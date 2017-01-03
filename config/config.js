/**
 * Created by INDIGO on 03/09/2015.
 */
if(process.env.NODE_ENV == "staging"){
  module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET || '<random-token>',
    VOTECK_MONGO_URI: process.env.MONGO_URI || 'mongodb://<user>:<password>@ds<port>.mlab.com:<port>/<dbname>',
    VOTECK_MONGO_PORT: process.env.MONGO_PORT || '<port>',
    VOTECK_MONGO_DB: process.env.MONGO_DB || 'db-staging-name',
    DB_ENV: 'staging'
  };
}else if(process.env.NODE_ENV == "production"){
  module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET || '<random-token>',
    VOTECK_MONGO_URI: process.env.MONGO_URI || 'mongodb://<user>:<password>@ds<port>.mlab.com:<port>/<dbname>',
    VOTECK_MONGO_PORT: process.env.MONGO_PORT || '<port>',
    VOTECK_MONGO_DB: process.env.MONGO_DB || 'db-production-name',
    DB_ENV: 'production'
  };
}else{
  module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET || ']<t2fNK!J==DYM~F7418[D2eaz=;$:SqX~d',
    MONGO_URI: process.env.MONGO_URI || 'localhost'
  };
}