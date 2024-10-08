const config = require('config');

const primaryMongoConfig = config.get('primaryDb');

// In this file you can configure migrate-mongo
const migrationsConfig = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: primaryMongoConfig.url,

    // TODO Change this to your database name:
    databaseName: "tailor",

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      ssl: primaryMongoConfig.ssl,
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    }
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations",

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog",

  // The file extension to create migrations and search for in migration dir 
  migrationFileExtension: ".js"
};

// Return the config as a promise
module.exports = migrationsConfig;
