require 'rails_helper'

RSpec.describe 'UserSessions', type: :system do
  let(:password) { "password123" }
  let(:user) { create(:user, password: password, password_confirmation: password) }

  describe 'ログイン' do
    context 'フォームの入力値が正常' do
      it 'ログイン処理が成功する' do
        puts "\n========== LOGIN SUCCESS TEST START =========="

        visit new_user_session_path

        fill_in 'Eメール', with: user.email
        fill_in 'パスワード', with: password

        click_button 'ログイン'

        puts "LOGIN SUCCESS TEST URL: #{page.current_url}"

        expect(page).to have_current_path(root_path)
        expect(page).to have_link('ログアウト', visible: false)

        puts "========== LOGIN SUCCESS TEST END ==========\n"
      end
    end

    context 'メールアドレスが未入力' do
      it 'ログイン処理が失敗する' do
        puts "\n========== EMPTY EMAIL TEST START =========="

        visit new_user_session_path

        fill_in 'Eメール', with: ''
        fill_in 'パスワード', with: password

        click_button 'ログイン'

        puts "EMPTY EMAIL TEST URL: #{page.current_url}"

        expect(page).to have_content('Eメール')
        expect(page).to have_content('パスワード')

        puts "========== EMPTY EMAIL TEST END ==========\n"
      end
    end

    context 'パスワードが未入力' do
      it 'ログイン処理が失敗する' do
        puts "\n========== EMPTY PASSWORD TEST START =========="

        visit new_user_session_path

        fill_in 'Eメール', with: user.email
        fill_in 'パスワード', with: ''

        click_button 'ログイン'

        puts "EMPTY PASSWORD TEST URL: #{page.current_url}"

        expect(page).to have_content('Eメール')
        expect(page).to have_content('パスワード')

        puts "========== EMPTY PASSWORD TEST END ==========\n"
      end
    end
  end
end
