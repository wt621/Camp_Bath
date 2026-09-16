class CreateFavorites < ActiveRecord::Migration[8.1]
  def change
    create_table :favorites do |t|
      t.references :user, null: false, foreign_key: true
      t.string :campsite_place_id, null: false
      t.string :onsen_place_id, null: false
    end

    add_index :favorites,
              [ :user_id, :campsite_place_id, :onsen_place_id ],
              unique: true
  end
end
