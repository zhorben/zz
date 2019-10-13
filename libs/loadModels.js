import connection from './connection'

export default async (models) => {

  let promises = [];
  for (let name in models) {
    let modelObjects = models[name];

    for (let modelObject of modelObjects) {
      promises.push(connection.model(name).create(modelObject));
    }
  }

  await Promise.all(promises);

};
