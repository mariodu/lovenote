# Helper methods defined here can be accessed in any controller or view in the application

Lovenote.helpers do
  def hash_to_query_string(hash)
    hash.collect {|k,v| "#{k}=#{v}"}.join('&')
  end

  def login_required
    if current_user == nil
      session[:return_to] = request.fullpath
      redirect '/login'
      return true
    else
      return false
    end
  end

  def current_user
    if session[:user]
      User.find_by( id: session[:user] )
    else
      nil
    end
  end

  def logged_in?
    !!session[:user]
  end
end
