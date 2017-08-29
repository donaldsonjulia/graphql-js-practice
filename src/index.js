const {execute, subscribe} = require('graphql');
const {createServer} = require('http');
const {SubscriptionServer} = require('subscriptions-transport-ws');
const express = require('express');
const bodyParser = require('body-parser'); // This package automatically parses JSON requests.
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express'); // This package will handle GraphQL server requests and responses for you based on your schema.
const schema = require('./schema');
const {authenticate} = require('./authentication');
const connectMongo = require('./mongo-connector');
const buildDataloaders = require('./dataloaders');
const formatError = require('./formatError');


const start = async () => {

  const buildOptions = async (req, res) => {
    const mongo = await connectMongo();
    const user = await authenticate(req, mongo.Users);
    return {
      context: {
        dataloaders: buildDataloaders(mongo),
        mongo,
        user
      }, //This context objet is passed to all resolvers
      formatError,
      schema
    };
  };
  const app = express();

  const PORT = 3000;

  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'bearer token-julia@example.com'`,
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
  }));

  const server = createServer(app);
  server.listen(PORT, () => {
    SubscriptionServer.create(
      {execute, subscribe, schema},
      {server, path: '/subscriptions'},
    );
    console.log(`Hackernews GraphQL server running on port ${PORT}.`)
  });

};

start();
