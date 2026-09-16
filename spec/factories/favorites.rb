FactoryBot.define do
  factory :favorite do
    association :user
    campsite_place_id { "campsite-place-id" }
    onsen_place_id { "onsen-place-id" }
  end
end
