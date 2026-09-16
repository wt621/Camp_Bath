class Favorite < ApplicationRecord
  belongs_to :user

  validates :campsite_place_id, presence: true
  validates :onsen_place_id, presence: true
end
