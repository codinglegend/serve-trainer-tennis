class RemoveTTcolumns < ActiveRecord::Migration
  def change
    remove_column :serves, :serve_length, :string
    remove_column :serves, :player_grip, :string
  end
end
