class Serve < ActiveRecord::Base
  has_attached_file :video
  validates_attachment_content_type :video, content_type: ['video/mp4', 'video/ogg']
  do_not_validate_attachment_file_type :video
end
