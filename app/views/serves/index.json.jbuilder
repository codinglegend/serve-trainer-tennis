json.array!(@serves) do |serve|
  json.extract! serve, :id, :player_name, :time_1, :serve_length, :serve_spin, :serve_direction, :player_grip
  json.url serve_url(serve, format: :json)
end
