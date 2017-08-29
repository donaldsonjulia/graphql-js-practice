const {Logger, MongoClient} = require('mongodb');

// 1 specify the url for connecting to the desired MongoDB instance
const MONGO_URL = 'mongodb://localhost:27017/hackernews';

// 2 export a function that connects to the db and returns the collections the resolvers will use
module.exports = async () => {
  const db = await MongoClient.connect(MONGO_URL);

  let logCount = 0;
  Logger.setCurrentLogger((msg, state) => {
    console.log(`MONGO DB REQUEST ${++logCount}: ${msg}`);
  });
  Logger.setLevel('debug');
  Logger.filter('class', ['Cursor']);

  return {
    Links: db.collection('links'),
    Users: db.collection('users'),
    Votes: db.collection('votes'),
  };
};
