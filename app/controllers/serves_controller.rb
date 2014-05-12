class ServesController < ApplicationController
  before_action :set_serve, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, except: [:quiz, :show_next, :show]

  # GET /serves
  # GET /serves.json
  def index
    @serves = Serve.all
  end

  # GET /serves/1
  # GET /serves/1.json
  def show
  end

  def quiz
  end

  def show_next

    total = Serve.count
    offset = session[:serve_offset] || 0
    if offset >= total
      offset = 0
    end
    @serve = Serve.order(created_at: :asc).limit(1).offset(offset).first
    session[:serve_offset] = offset + 1

    render 'show_next.json'
  end

  # GET /serves/new
  def new
    @serve = Serve.new
  end

  # GET /serves/1/edit
  def edit
  end

  # POST /serves
  # POST /serves.json
  def create
    @serve = Serve.new(serve_params)

    respond_to do |format|
      if @serve.save
        format.html { redirect_to @serve, notice: 'Serve was successfully created.' }
        format.json { render action: 'show', status: :created, location: @serve }
      else
        format.html { render action: 'new' }
        format.json { render json: @serve.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /serves/1
  # PATCH/PUT /serves/1.json
  def update
    respond_to do |format|
      if @serve.update(serve_params)
        format.html { redirect_to @serve, notice: 'Serve was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @serve.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /serves/1
  # DELETE /serves/1.json
  def destroy
    @serve.destroy
    respond_to do |format|
      format.html { redirect_to serves_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_serve
      @serve = Serve.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def serve_params
      params.require(:serve).permit(:player_name, :time_1, :time_2, :serve_length, :serve_spin, :serve_direction, :player_grip, :video)
    end
end
