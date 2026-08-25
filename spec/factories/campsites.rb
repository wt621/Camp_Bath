FactoryBot.define do
  factory :campsite do
    name { "テストキャンプ場" }
    address { "テスト県テスト市" }
    latitude { 35.681236 }
    longitude { 139.767125 }
    association :user
  end
end
