require 'test_helper'

class ServesControllerTest < ActionController::TestCase
  setup do
    @serf = serves(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:serves)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create serf" do
    assert_difference('Serve.count') do
      post :create, serf: { player_grip: @serf.player_grip, player_name: @serf.player_name, serve_direction: @serf.serve_direction, serve_length: @serf.serve_length, serve_spin: @serf.serve_spin, time_1: @serf.time_1, time_2: @serf.time_2 }
    end

    assert_redirected_to serf_path(assigns(:serf))
  end

  test "should show serf" do
    get :show, id: @serf
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @serf
    assert_response :success
  end

  test "should update serf" do
    patch :update, id: @serf, serf: { player_grip: @serf.player_grip, player_name: @serf.player_name, serve_direction: @serf.serve_direction, serve_length: @serf.serve_length, serve_spin: @serf.serve_spin, time_1: @serf.time_1, time_2: @serf.time_2 }
    assert_redirected_to serf_path(assigns(:serf))
  end

  test "should destroy serf" do
    assert_difference('Serve.count', -1) do
      delete :destroy, id: @serf
    end

    assert_redirected_to serves_path
  end
end
