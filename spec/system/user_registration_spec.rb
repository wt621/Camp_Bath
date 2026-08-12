require 'rails_helper'

RSpec.describe 'ユーザー新規登録', type: :system do
  it '新規登録できること' do
    visit new_user_registration_path

    fill_in '名前', with: '新規登録ユーザー'
    fill_in 'Eメール', with: 'newuser@example.com'
    fill_in 'パスワード', with: 'password123'
    fill_in 'パスワード（確認用）', with: 'password123'

    click_button 'アカウント登録'

    expect(page).to have_current_path(root_path)
  end
end
