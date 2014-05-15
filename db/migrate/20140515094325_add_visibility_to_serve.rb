class AddVisibilityToServe < ActiveRecord::Migration
  def change
    add_column :serves, :visible, :boolean, default: true
  end
end
