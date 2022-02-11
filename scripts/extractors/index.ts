
import DB from '../../models';
import pharmacyExtractor from './pharmacy.extractor';
import userExtractor from './user.extractor';

(async ()=>{
  try {
    const args = process.argv.slice(2);
    const fileName = args[0];
    const dataType = args[1].trim().toLowerCase();
    const json = (await import(`../../../data/${fileName}`)).default;
    console.log(fileName, dataType);
    await DB.connect();
    console.log(`database success sync !!!`);

    switch (dataType) {
    case 'pharmacy':
      pharmacyExtractor(json);
      break;
    case 'user':
      userExtractor(json);
      break;
    default:
      throw new Error('Format error!');
    }
  } catch (err) {
    throw err;
  }
})();


