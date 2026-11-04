Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

ROUTES_RATE_LIMIT_MUTEX = Mutex.new

Rack::Attack.blocklist("Routes API rolling rate limit") do |req|
  next false unless req.get? && req.path == "/routes/calculate"

  user = req.env["warden"]&.user

  if user
    key = "routes:user:#{user.id}"
    limit = 30
  else
    key = "routes:ip:#{req.ip}"
    limit = 10
  end

  now = Time.now.to_f
  window_start = now - 24.hours.to_f

  ROUTES_RATE_LIMIT_MUTEX.synchronize do
    store = Rack::Attack.cache.store

    timestamps = store.read(key) || []
    timestamps = timestamps.select do |timestamp|
      timestamp > window_start
    end

    if timestamps.size >= limit
      store.write(key, timestamps, expires_in: 24.hours)
      true
    else
      timestamps << now
      store.write(key, timestamps, expires_in: 24.hours)
      false
    end
  end
end

Rack::Attack.blocklisted_responder = lambda do |_request|
  [
    429,
    { "Content-Type" => "application/json; charset=utf-8" },
    [
      {
        error: "1日の検索上限に達しました",
        code: "daily_limit_exceeded"
      }.to_json
    ]
  ]
end
