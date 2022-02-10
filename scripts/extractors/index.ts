
import DB from '../../models';
import pharmacyExtractor from './pharmacyExtractor';
import userExtractor from './userExtractor';

(async ()=>{
  try {
    const args = process.argv.slice(2);
    const fileName = args[0];
    const dataType = args[1].trim().toLowerCase();
    const json = (await import(`../../../data/${fileName}`)).default;
    console.log(fileName, dataType);
    await DB.init();
    await DB.connect();
    console.log(`database success sync !!!`);

    switch (dataType) {
    case 'pharmacy':
      pharmacyExtractor(json);
      break;
    case 'user':
      userExtractor(json);
      break;
    }
  } catch (err) {
    throw err;
  }
})();


