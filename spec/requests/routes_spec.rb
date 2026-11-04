require "rails_helper"

RSpec.describe "Routes", type: :request do
  let(:valid_params) do
    {
      origin_lat: "35.681236",
      origin_lng: "139.767125",
      destination_lat: "35.658034",
      destination_lng: "139.701636"
    }
  end

  let(:routes_response) do
    double(
      success?: true,
      body: {
        routes: [
          {
            distanceMeters: 3000,
            duration: "600s"
          }
        ]
      }.to_json
    )
  end

  before do
    Rack::Attack.cache.store.clear
    allow(Faraday).to receive(:post).and_return(routes_response)
  end

  describe "GET /routes/calculate" do
    context "未ログインの場合" do
      it "10回までは許可し、11回目を制限する" do
        10.times do
          get "/routes/calculate", params: valid_params
          expect(response).to have_http_status(:ok)
        end

        get "/routes/calculate", params: valid_params

        expect(response).to have_http_status(:too_many_requests)
        expect(response.parsed_body).to include(
          "error" => "1日の検索上限に達しました",
          "code" => "daily_limit_exceeded"
        )
      end

      it "上限超過時はGoogle Routes APIを呼び出さない" do
        10.times do
          get "/routes/calculate", params: valid_params
        end

        expect(Faraday).not_to receive(:post)

        get "/routes/calculate", params: valid_params

        expect(response).to have_http_status(:too_many_requests)
      end
    end

        context "ログイン済みの場合" do
      let(:password) { "password123" }

      let(:user) do
        create(
          :user,
          password: password,
          password_confirmation: password
        )
      end

      before do
        sign_in user
      end

      it "30回までは許可し、31回目を制限する" do
        30.times do
          get "/routes/calculate", params: valid_params
          expect(response).to have_http_status(:ok)
        end

        get "/routes/calculate", params: valid_params

        expect(response).to have_http_status(:too_many_requests)
      end

      it "別のユーザーは独立してカウントされる" do
        30.times do
          get "/routes/calculate", params: valid_params
        end

        sign_out user

        another_user = create(
          :user,
          password: password,
          password_confirmation: password
        )

        sign_in another_user

        get "/routes/calculate", params: valid_params

        expect(response).to have_http_status(:ok)
      end
    end
  end
end
