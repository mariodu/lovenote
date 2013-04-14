Lovenote.controllers :user do
  layout :vistor
  # get :index, :map => "/foo/bar" do
  #   session[:foo] = "bar"
  #   render 'index'
  # end

  # get :sample, :map => "/sample/url", :provides => [:any, :js] do
  #   case content_type
  #     when :js then ...
  #     else ...
  # end

  # get :foo, :with => :id do
  #   "Maps to url '/foo/#{params[:id]}'"
  # end

  # get "/example" do
  #   "Hello world!"
  # end
  #

  get :login, :map => "/login/?" do
    if session[:user]
      redirect '/'
    else
      render 'user/login'
    end
  end

  post :login, :map => "/login/?" do
    reponse = {}
    result = User.authenticate(params[:username], params[:password])
    failCode = result[:failCode]
    reponse[:code] = false if failCode
    if failCode == 100
      failDescription = itext("pwdwrong")
    elsif failCode == 101
      failDescription = itext("unknownuser")
    else
      failDescription = nil
    end
    user = result[:user]
    if user && failCode.nil?
      session[:user] = user.id
      if session[:return_to]
        reponse[:return_to] = session[:return_to]
        session[:return_to] = false
      else
        if user.readed == false
          reponse[:return_to] = '/letter'
        else
          reponse[:return_to] = '/'
        end
      end
    else
      reponse[:failCode] = failCode
      reponse[:failDescription] = failDescription
    end
    reponse.to_json
  end

  get :logout, :map => '/logout/?' do
    session[:user] = nil
    flash[:notice] = itext("logout_succed")
    return_to = ( session[:return_to] ? session[:return_to] : '/login' )
    redirect return_to
  end

end
