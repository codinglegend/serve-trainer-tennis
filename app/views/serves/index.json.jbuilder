json.array!(@serves) do |serve|
  json.extract! serve, :id, :player_name, :time_1, :serve_spin, :serve_direction
  json.url serve_url(serve, format: :json)
end
