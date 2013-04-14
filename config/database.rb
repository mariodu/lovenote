Mongoid.load!("config/mongoid.yml")
# Connection.new takes host, port
# host = 'localhost'
# port = Mongo::Connection::DEFAULT_PORT

# database_name = case Padrino.env
#   when :development then 'lovenote'
#   when :production  then 'lovenote'
#   when :test        then 'lovenote_test'
# end

# Mongoid.database = Mongo::Connection.new(host, port).db(database_name)

# You can also configure Mongoid this way
# Mongoid.configure do |config|
#   name = 'lovenote'
#   host = 'localhost'
#   config.master = Mongo::Connection.new.db(name)
# end
#
# More installation and setup notes are on http://mongoid.org/docs/
