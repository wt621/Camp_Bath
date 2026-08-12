require 'rails_helper'

RSpec.describe 'ページ表示', type: :request do
  describe 'GET /' do
    it 'TOPページが表示できること' do
      get root_path

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /search' do
    it '検索ページが未ログインでも表示できること' do
      get search_path

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /terms' do
    it '利用規約ページが表示できること' do
      get terms_path

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET /privacy_policy' do
    it 'プライバシーポリシーページが表示できること' do
      get privacy_policy_path

      expect(response).to have_http_status(:ok)
    end
  end
end
