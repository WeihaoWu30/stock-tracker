const MongoStore = require('connect-mongo');
console.log('Type of MongoStore:', typeof MongoStore);
console.log('MongoStore keys:', Object.keys(MongoStore));
console.log('MongoStore.create exists?', typeof MongoStore.create);
if (MongoStore.default) {
   console.log('MongoStore.default exists');
   console.log('MongoStore.default keys:', Object.keys(MongoStore.default));
   console.log('MongoStore.default.create exists?', typeof MongoStore.default.create);
}
