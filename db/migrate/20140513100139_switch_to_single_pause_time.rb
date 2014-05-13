class SwitchToSinglePauseTime < ActiveRecord::Migration
  def change
    remove_column :serves, :time_1, :decimal
    rename_column :serves, :time_2, :time_1
  end
end
