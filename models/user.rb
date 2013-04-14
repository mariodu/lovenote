class User
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields

  # field <name>, :type => <type>, :default => <value>
  field :username, :type => String
  field :name,   :type => String
  field :email, :type => String
  field :nickname, :type => String
  field :hashed_password, :type => String
  field :salt, :type => String
  field :birthday, :type => Date
  field :gender, :type => String
  field :first, :type => Boolean, :default => true
  field :readed, :type => Boolean, :default => false
  field :confirm_token, :type => String
  field :remember_token, :type => String

  # You can define indexes on documents using the index macro:
  index({ username: 1 }, { unique: true, name: "username_index" })

  attr_accessor :password, :password_confirmation

  def password=(pass)
    @password = pass
    self.salt = User.random_string(10) if !self.salt
    self.hashed_password = User.encrypt(@password, self.salt)
  end

  def self.authenticate(username, pass)
    current_user = User.where(:username => username).first
    return {:failCode => 101, :user => nil} if current_user.nil?
    return {:failCode => nil, :user => current_user} if User.encrypt(pass, current_user.salt) == current_user.hashed_password
    {:failCode => 100, :user => nil}
  end

  protected

  def method_missing(m, *args)
    return false
  end

  def self.encrypt(pass, salt)
    Digest::SHA1.hexdigest(pass + salt)
  end

  def self.random_string(len)
    #generate a random password consisting of strings and digits
    chars = ("a".."z").to_a + ("A".."Z").to_a + ("0".."9").to_a
    newpass = ""
    1.upto(len) { |i| newpass << chars[rand(chars.size-1)] }
    return newpass
  end

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>
end
