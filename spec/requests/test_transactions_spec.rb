require 'rails_helper'

RSpec.describe "TestTransactions", type: :request do
  describe "GET /check" do
    it "returns http success" do
      get "/test_transactions/check"
      expect(response).to have_http_status(:success)
    end
  end

end
