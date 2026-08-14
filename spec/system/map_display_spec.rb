require 'rails_helper'

RSpec.describe '地図表示エリア', type: :system do
  it '検索画面に地図表示エリアが存在すること' do
    visit search_path

    expect(page).to have_css('#map')
  end
end
