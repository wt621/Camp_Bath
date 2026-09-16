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
end
