class AddAttachmentVideoToServes < ActiveRecord::Migration
  def self.up
    change_table :serves do |t|
      t.attachment :video
    end
  end

  def self.down
    drop_attached_file :serves, :video
  end
end
