import Mask from '../../models/mask.model';
import Pharmacy from '../../models/pharmacy.model';
import ServiceHour from '../../models/serviceHour.model';
import {maskParser, openingHoursParser} from '../../utils/parser';

interface MaskData {
  name: string
  price: number
}

interface PharmacyData {
  name: string
  cashBalance: number
  openingHours: string
  masks: MaskData[]
}

export default async (json: PharmacyData[])=>{
  try {
    const response = json.map(async ({
      name,
      cashBalance,
      openingHours,
      masks,
    }: PharmacyData) => {
      const [pharmacy] = await Pharmacy.findOrCreate({
        where: {
          name: name,
        },
        defaults: {
          name: name,
          cashBalance: cashBalance,
        },
      });

      if (!pharmacy) {
        return;
      }

      const bulkMaskCreate = masks.map(({
        name, price,
      }) => {
        const details = maskParser(name);
        return Mask.findOrCreate({
          where: {
            ...details,
            pharmacyId: pharmacy.id,
          },
          defaults: {
            ...details,
            price,
            pharmacyId: pharmacy.id,
          },
        });
      });

      const bulkDAHCreate = openingHoursParser(openingHours).map((dah) => {
        return ServiceHour.findOrCreate({
          where: {
            ...dah,
            pharmacyId: pharmacy.id,
          },
          defaults: {
            ...dah,
            pharmacyId: pharmacy.id,
          },
        });
      });

      return Promise.all([bulkMaskCreate, bulkDAHCreate]);
    });

    await Promise.all(response);
  } catch (err) {
    throw err;
  }
};
