class CampsiteSearchService
  def initialize(latitude:, longitude:, distance: 50, limit: 20)
    @latitude = latitude.to_f
    @longitude = longitude.to_f
    @distance = distance
    @limit = limit
  end

  def call
    Campsite.near(latitude, longitude, distance).recent(limit)
  end

  private

  attr_reader :latitude, :longitude, :distance, :limit
end
