const {promisify} = require('util');
const assert = require('assert');
const mongoose = require('./mongoose');

module.exports = async function clearDatabase() {

  if (mongoose.connection.readyState == 2) { // connecting
    await promisify(cb => mongoose.connection.on('open', cb))();
  }
  assert(mongoose.connection.readyState == 1);

  const db = mongoose.connection.db;

  let collections = await promisify(cb => db.listCollections().toArray(cb))();

  collections = collections
    .filter(coll => !coll.name.startsWith('system.'))
    .map(coll => db.collection(coll.name)); // plain object with info => collection object

  await Promise.all(
    // collections.map(coll => promisify(cb => coll.drop(cb))())
    collections.map(coll => {
      const drop = promisify(coll.drop.bind(coll));
      return drop();
    })
  );

  await Promise.all(mongoose.modelNames().map(function(modelName) {
    const model = mongoose.model(modelName);
    return promisify(cb => model.ensureIndexes(cb))();
  }));
};
