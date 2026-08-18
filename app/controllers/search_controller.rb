class SearchController < ApplicationController
  skip_before_action :authenticate_user!

  def regions
    @regions = AreaData.all_regions
  end

  def prefectures
    region = params[:region]
    @prefectures = AreaData.prefectures_by_region(region)
    @region = region
  end

  def areas
    @region_key = params[:region]
    @prefecture_key = params[:prefecture]
    @areas = AreaData.areas_by_prefecture(@region_key, @prefecture_key)
  end

  def index
    @latitude = params[:latitude] || 35.681236
    @longitude = params[:longitude] || 139.767125
  end
end
