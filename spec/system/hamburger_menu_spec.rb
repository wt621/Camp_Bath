require 'rails_helper'

RSpec.describe 'ハンバーガーメニュー', type: :system do
  let(:user) { create(:user) }

  before do
    visit new_user_session_path

    fill_in 'Eメール', with: user.email
    fill_in 'パスワード', with: user.password

    click_button 'ログイン'
  end

  describe 'ハンバーガーボタンの表示' do
    it 'ログイン後にハンバーガーボタンが表示されること' do
      expect(page).to have_button('≡')
    end
  end

  describe 'ハンバーガーメニューの開閉' do
    it 'ハンバーガーメニューを開くとメニュー項目が表示されること', js: true do
      find('#hamburger-button').click

      expect(page).to have_css('#hamburger-menu', visible: true)
      expect(page).to have_link('ユーザー設定')
      expect(page).to have_link('ログアウト')
    end
  end
end
