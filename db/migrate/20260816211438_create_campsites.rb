class CreateCampsites < ActiveRecord::Migration[8.1]
  def change
    create_table :campsites do |t|
      t.string :name
      t.string :address
      t.float :latitude
      t.float :longitude
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
