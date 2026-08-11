require 'rails_helper'

RSpec.describe User, type: :model do
  it '有効なファクトリを持つこと' do
    expect(build(:user)).to be_valid
  end

  describe 'バリデーション' do
    it '名前が必須であること' do
      user = build(:user, name: nil)

      expect(user).to be_invalid
      expect(user.errors[:name]).to be_present
    end

    it 'メールアドレスが必須であること' do
      user = build(:user, email: nil)

      expect(user).to be_invalid
      expect(user.errors[:email]).to be_present
    end

    it 'メールアドレスが重複しないこと' do
      create(:user, email: 'test@example.com')
      user = build(:user, email: 'test@example.com')

      expect(user).to be_invalid
      expect(user.errors[:email]).to be_present
    end

    it 'パスワードが6文字未満の場合は無効であること' do
      user = build(:user, password: '12345', password_confirmation: '12345')

      expect(user).to be_invalid
      expect(user.errors[:password]).to be_present
    end
  end
end
