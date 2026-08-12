require 'rails_helper'

RSpec.describe 'UserSessions', type: :system do
  let(:user) { create(:user) }

  describe 'ログイン' do
    context 'フォームの入力値が正常' do
      it 'ログイン処理が成功する' do
        visit new_user_session_path

        fill_in 'Eメール', with: user.email
        fill_in 'パスワード', with: user.password

        click_button 'ログイン'

        expect(page).to have_current_path(root_path)
      end
    end

    context 'メールアドレスが未入力' do
      it 'ログイン処理が失敗する' do
        visit new_user_session_path

        fill_in 'Eメール', with: ''
        fill_in 'パスワード', with: user.password

        click_button 'ログイン'

        expect(page).to have_content('Eメールまたはパスワードが違います。')
      end
    end

    context 'パスワードが未入力' do
      it 'ログイン処理が失敗する' do
        visit new_user_session_path

        fill_in 'Eメール', with: user.email
        fill_in 'パスワード', with: ''

        click_button 'ログイン'

        expect(page).to have_content('Eメールまたはパスワードが違います。')
      end
    end
  end

  describe 'ログアウト' do
    before do
      visit new_user_session_path

      fill_in 'Eメール', with: user.email
      fill_in 'パスワード', with: user.password

      click_button 'ログイン'
    end

    it 'ログアウト処理が成功する' do
        logout_link = find('a', text: 'ログアウト', visible: false)
      page.execute_script('arguments[0].click();', logout_link)

      expect(page).to have_current_path(root_path)
      expect(page).not_to have_link('ログアウト', visible: false)
    end
  end
end
