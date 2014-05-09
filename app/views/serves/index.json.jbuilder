json.array!(@serves) do |serf|
  json.extract! serf, :id, :player_name, :time_1, :time_2, :serve_length, :serve_spin, :serve_direction, :player_grip
  json.url serf_url(serf, format: :json)
end
