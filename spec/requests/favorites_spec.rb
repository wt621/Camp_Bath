require 'rails_helper'

RSpec.describe "Favorites", type: :request do
  let(:password) { "password123" }
  let(:user) { create(:user, password: password, password_confirmation: password) }

  describe "POST /favorites" do
    context "ログインしている場合" do
      before do
        sign_in user
      end

      it "キャンプ場と温泉のセットを保存できること" do
        expect {
          post favorites_path, params: {
            campsite_place_id: "campsite-place-id",
            onsen_place_id: "onsen-place-id"
          }
        }.to change(Favorite, :count).by(1)

        favorite = Favorite.last

        expect(favorite.user).to eq(user)
        expect(favorite.campsite_place_id).to eq("campsite-place-id")
        expect(favorite.onsen_place_id).to eq("onsen-place-id")
        expect(response.parsed_body).to eq({ "saved" => true })
      end

      it "同じセットが保存済みなら削除されること" do
        create(
          :favorite,
          user: user,
          campsite_place_id: "campsite-place-id",
          onsen_place_id: "onsen-place-id"
        )

        expect {
          post favorites_path, params: {
            campsite_place_id: "campsite-place-id",
            onsen_place_id: "onsen-place-id"
          }
        }.to change(Favorite, :count).by(-1)
        expect(response.parsed_body).to eq({ "saved" => false })
      end
    end

    context "ログインしていない場合" do
      it "ログインページへリダイレクトされること" do
        post favorites_path, params: {
          campsite_place_id: "campsite-place-id",
          onsen_place_id: "onsen-place-id"
        }

        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end

  describe "GET /favorites" do
    context "ログインしている場合" do
      before do
        sign_in user
      end

      it "お気に入りページを表示できること" do
        get favorites_path

        expect(response).to have_http_status(:ok)
      end

      it "ログイン中のユーザーのお気に入りだけを取得すること" do
        favorite = create(
          :favorite,
          user: user,
          campsite_place_id: "user-campsite-place-id",
          onsen_place_id: "user-onsen-place-id"
        )

        other_user = create(:user)

        other_favorite = create(
          :favorite,
          user: other_user,
          campsite_place_id: "other-campsite-place-id",
          onsen_place_id: "other-onsen-place-id"
        )

        get favorites_path

        expect(response.body).to include(favorite.campsite_place_id)
        expect(response.body).to include(favorite.onsen_place_id)
        expect(response.body).not_to include(other_favorite.campsite_place_id)
        expect(response.body).not_to include(other_favorite.onsen_place_id)
      end
    end

    context "ログインしていない場合" do
      it "ログインページへリダイレクトされること" do
        get favorites_path

        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end

  describe "GET /favorites/check" do
    context "ログインしている場合" do
      before do
        sign_in user
      end

      it "お気に入り登録済みの場合はsavedがtrueになること" do
        create(
          :favorite,
          user: user,
          campsite_place_id: "campsite-place-id",
          onsen_place_id: "onsen-place-id"
        )

        get favorites_check_path, params: {
          campsite_place_id: "campsite-place-id",
          onsen_place_id: "onsen-place-id"
        }

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq({ "saved" => true })
      end

      it "お気に入り登録されていない場合はsavedがfalseになること" do
        get favorites_check_path, params: {
          campsite_place_id: "campsite-place-id",
          onsen_place_id: "onsen-place-id"
        }

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to eq({ "saved" => false })
      end
    end

    context "ログインしていない場合" do
      it "ログインページへリダイレクトされること" do
        get favorites_check_path, params: {
          campsite_place_id: "campsite-place-id",
          onsen_place_id: "onsen-place-id"
        }

        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
end
