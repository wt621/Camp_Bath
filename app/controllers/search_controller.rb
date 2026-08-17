class SearchController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :index ]

  def index

    @campsites = Campsite.includes(:user).all
  end
end
