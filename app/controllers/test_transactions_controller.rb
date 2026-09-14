class TestTransactionsController < ApplicationController
  skip_before_action :authenticate_user!, only: :check

  def check
    email = params[:email]
    user = User.find_by(email: email)

    render plain: user ? "USER_FOUND" : "USER_NOT_FOUND"
  end
end
