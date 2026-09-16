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

    it 'お気に入りが登録されていない場合のメッセージが表示されること' do
      visit favorites_path

      expect(page).to have_content(
        'お気に入り登録したキャンプ場はありません。'
      )
      expect(page).to have_content(
        'お気に入り登録した温泉施設はありません。'
      )
    end
  end

  describe 'ログインしていない場合' do
    it 'ログインページへリダイレクトされること' do
      visit favorites_path

      expect(page).to have_current_path(new_user_session_path)
    end
  end
end
