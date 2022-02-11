import DB from '../models';

(async ()=>{
  await DB.connect();
  await DB.dropAllTables();
  console.log('Drop All Table Success!');
})();
