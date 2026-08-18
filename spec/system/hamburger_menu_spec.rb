require 'rails_helper'

RSpec.describe 'ハンバーガーメニュー', type: :system do
  let(:user) { create(:user) }

  before do
    sign_in user
    visit root_path
  end

  describe 'ハンバーガーボタンの表示' do
    it 'ログイン後にハンバーガーボタンが表示されること' do
      expect(page).to have_button('≡')
    end
  end

  describe 'ハンバーガーメニューの開閉' do
    it 'ハンバーガーメニューを開くとメニュー項目が表示されること', js: true do
      expect(page).to have_button('≡', wait: 10)

      expect(page).to have_css('#hamburger-button', wait: 10)

      find('#hamburger-button').click

      expect(page).to have_css('#hamburger-menu', visible: true, wait: 10)
      expect(page).to have_link('ユーザー設定')
      expect(page).to have_link('ログアウト')
    end
  end
end
