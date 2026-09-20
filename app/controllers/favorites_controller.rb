class FavoritesController < ApplicationController
  def index
    @favorites = current_user.favorites
  end

  def create
    favorite = current_user.favorites.find_or_initialize_by(
      campsite_place_id: favorite_params[:campsite_place_id],
      onsen_place_id: favorite_params[:onsen_place_id]
    )

    if favorite.persisted?
      favorite.destroy!
      render json: { saved: false }
    else
      favorite.save!
      render json: { saved: true }
    end
  end

  def check
    favorite = current_user.favorites.find_by(
      campsite_place_id: params[:campsite_place_id],
      onsen_place_id: params[:onsen_place_id]
    )

    render json: { saved: favorite.present? }
  end

  private

  def favorite_params
    params.permit(:campsite_place_id, :onsen_place_id)
  end
end
