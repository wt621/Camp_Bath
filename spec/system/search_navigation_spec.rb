require 'rails_helper'

RSpec.describe '検索画面への遷移', type: :system do
  it 'TOPページから検索画面へ遷移できること' do
    visit root_path

    click_link '検索する'

    expect(page).to have_current_path(search_path)
  end
end
