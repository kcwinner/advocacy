import RDSDataAPI from './knex/RDSDataClient';

module.exports = {
  local: {
    client: "mysql",
    connection: {
      host: "localhost",
      database: "demo",
      user: "localadmin",
      password: "local"
    },
    migrations: {
      tableName: "knex_migrations",
      directory: './knex/migrations'
    },
    seeds: {
      directory: './knex/seeds'
    }
  },
  demo: {
    client: RDSDataAPI,
    connection: {
      secretArn: process.env.DB_SECRET_ARN,
      resourceArn: process.env.DB_CLUSTER_ARN,
      database: `demo`,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: './knex/migrations'
    },
    seeds: {
      directory: './knex/seeds'
    }
  }
};
