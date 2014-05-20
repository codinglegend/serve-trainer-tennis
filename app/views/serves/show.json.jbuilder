json.extract! @serve, :id, :player_name, :time_1, :serve_spin, :serve_direction, :created_at, :updated_at
json.video @serve.video.url(:original, timestamp: false)
