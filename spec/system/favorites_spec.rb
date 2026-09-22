require 'rails_helper'

RSpec.describe 'お気に入りページ', type: :system do
  let(:user) { create(:user) }

  describe 'ログイン済みの場合' do
    before do
      sign_in user
    end

    it 'お気に入りページを表示できること' do
      visit favorites_path

      expect(page).to have_current_path(favorites_path)
      expect(page).to have_content('お気に入り')
      expect(page).to have_content('キャンプ場')
      expect(page).to have_content('温泉施設')
    end

    it 'お気に入りが登録されていない場合でもセット表示の見出しが表示されること' do
      visit favorites_path

      expect(page).to have_content('キャンプ場・温泉施設')
    end

    it 'お気に入り登録済みのセットが表示されること' do
      create(
        :favorite,
        user: user,
        campsite_place_id: 'campsite-place-id',
        onsen_place_id: 'onsen-place-id'
      )

      visit favorites_path

      expect(page).to have_css(
        '[data-favorite-item][data-campsite-place-id="campsite-place-id"]'
      )
      expect(page).to have_css(
        '[data-favorite-item][data-onsen-place-id="onsen-place-id"]'
      )
      expect(page).to have_button('お気に入りから削除')
    end

    it 'お気に入りセットから検索ページへ遷移できること' do
      create(
        :favorite,
        user: user,
        campsite_place_id: 'campsite-place-id',
        onsen_place_id: 'onsen-place-id'
      )

      visit favorites_path

      expect(page).to have_link(
        href: search_path(
          campsite_place_id: 'campsite-place-id',
          onsen_place_id: 'onsen-place-id'
        )
      )
    end

    it 'お気に入りから削除するとセットが表示されなくなること' do
      create(
        :favorite,
        user: user,
        campsite_place_id: 'campsite-place-id',
        onsen_place_id: 'onsen-place-id'
      )

      visit favorites_path

      expect(page).to have_css(
        '[data-favorite-item][data-campsite-place-id="campsite-place-id"]'
      )

      expect do
        find(
          '[data-favorite-item][data-campsite-place-id="campsite-place-id"]'
        ).find_button('お気に入りから削除').click
        expect(page).to have_no_css(
          '[data-favorite-item][data-campsite-place-id="campsite-place-id"]'
        )
      end.to change(Favorite, :count).by(-1)
    end
  end

  describe 'ログインしていない場合' do
    it 'ログインページへリダイレクトされること' do
      visit favorites_path

      expect(page).to have_current_path(new_user_session_path)
    end
  end
end
