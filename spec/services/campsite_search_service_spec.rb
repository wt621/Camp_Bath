require 'rails_helper'

RSpec.describe CampsiteSearchService do
  describe '#call' do
    let(:user) { create(:user) }

    context '検索範囲内にキャンプ場がある場合' do
      it '該当するキャンプ場を返すこと' do
        near_campsite = create(:campsite, user: user, latitude: 35.681236, longitude: 139.767125)

        result = described_class.new(latitude: 35.681236, longitude: 139.767125).call

        expect(result).to include(near_campsite)
      end
    end

    context '検索範囲外にキャンプ場がある場合' do
      it '該当するキャンプ場を含まないこと' do
        far_campsite = create(:campsite, user: user, latitude: 26.2124, longitude: 127.6809) # 沖縄

        result = described_class.new(latitude: 35.681236, longitude: 139.767125).call

        expect(result).not_to include(far_campsite)
      end
    end
  end
end
