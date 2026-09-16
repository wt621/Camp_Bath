require 'rails_helper'

RSpec.describe Favorite, type: :model do
  describe 'バリデーション' do
    it 'キャンプ場のPlace IDと温泉のPlace IDがあれば有効であること' do
      favorite = build(
        :favorite,
        campsite_place_id: 'campsite-place-id',
        onsen_place_id: 'onsen-place-id'
      )

      expect(favorite).to be_valid
    end

    it 'キャンプ場のPlace IDがなければ無効であること' do
      favorite = build(
        :favorite,
        campsite_place_id: nil,
        onsen_place_id: 'onsen-place-id'
      )

      expect(favorite).to be_invalid
    end

    it '温泉のPlace IDがなければ無効であること' do
      favorite = build(
        :favorite,
        campsite_place_id: 'campsite-place-id',
        onsen_place_id: nil
      )

      expect(favorite).to be_invalid
    end
  end
end
