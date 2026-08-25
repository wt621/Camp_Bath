class Campsite < ApplicationRecord
  belongs_to :user

  scope :near, ->(latitude, longitude, distance_km) {
    where(
      "6371 * acos(
        cos(radians(?)) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(?)) +
        sin(radians(?)) * sin(radians(latitude))
      ) <= ?",
      latitude, longitude, latitude, distance_km
    )
  }

  scope :recent, ->(limit = 20) { order(created_at: :desc).limit(limit) }
end
