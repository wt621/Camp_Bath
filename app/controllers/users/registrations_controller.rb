class Users::RegistrationsController < Devise::RegistrationsController
  before_action :authenticate_user!, only: [ :profile ]

  def profile
  end
end
