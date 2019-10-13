import { promisify } from 'util'
import assert from 'assert'
import connection from '../libs/connection'

export const clearDatabase = async () => {

  if (connection.readyState === 2) { // connecting
    await promisify(cb => connection.on('open', cb))();
  }
  assert(connection.readyState === 1);

  const db = connection.db;

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

  await Promise.all(connection.modelNames().map(function(modelName) {
    const model = connection.model(modelName);
    return promisify(cb => model.createIndexes(cb))();
  }));
};
