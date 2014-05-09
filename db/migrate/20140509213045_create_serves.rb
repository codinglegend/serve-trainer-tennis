class CreateServes < ActiveRecord::Migration
  def change
    create_table :serves do |t|
      t.string :player_name
      t.decimal :time_1
      t.decimal :time_2
      t.string :serve_length
      t.string :serve_spin
      t.string :serve_direction
      t.string :player_grip

      t.timestamps
    end
  end
end
