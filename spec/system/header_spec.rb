require 'rails_helper'

RSpec.describe 'ヘッダー', type: :system do
  it 'ロゴ画像が表示され、TOPページへのリンクになっていること' do
    visit root_path

    expect(page).to have_css(
      'header img.header-logo[alt="Camp-Bath"]'
    )
    expect(page).to have_link(
      href: root_path
    )
  end
end
