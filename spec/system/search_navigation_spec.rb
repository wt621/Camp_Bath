require 'rails_helper'

RSpec.describe '検索画面への遷移', type: :system do
  it 'TOPページから地域選択画面へ遷移できること' do
    visit root_path
    click_link '検索する'
    expect(page).to have_current_path(search_regions_path)
  end

  it '地方選択から都道府県選択へ遷移できること' do
    visit search_regions_path
    click_link '関東地方'
    expect(page).to have_current_path(search_prefectures_path(region: 'kanto'))
  end

  it '都道府県選択からエリア選択へ遷移できること' do
    visit search_prefectures_path(region: 'kanto')
    click_link '東京都'
    expect(page).to have_current_path(
      search_areas_path(region: 'kanto', prefecture: 'tokyo')
    )
  end

  it 'エリア選択から地図画面へ遷移できること' do
    visit search_areas_path(region: 'kanto', prefecture: 'tokyo')
    click_link '23区エリア'
    expect(page).to have_current_path(/^\/search/)
  end
end
