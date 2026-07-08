class UsersController < ApplicationController
  # ✨ profile アクションが実行される前に、Deviseのログインチェックを動かす！
  before_action :authenticate_user!, only: [:profile]

  def profile
    # ここにプロフィール画面用の処理を書きます
  end
end
