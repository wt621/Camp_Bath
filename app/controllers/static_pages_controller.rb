class StaticPagesController < ApplicationController
  skip_before_action :authenticate_user!

  def terms
  end
end
