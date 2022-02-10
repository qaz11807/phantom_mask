import DB from '../../models';
import {maskParser, openingHoursParser} from '../../utils/parser';

interface Mask {
  name: string
  price: number
}

interface Pharmacy {
  name: string
  cashBalance: number
  openingHours: string
  masks: Mask[]
}

export default async (json: Pharmacy[])=>{
  try {
    const Pharmacy = DB.models.Pharmacy;
    const Mask = DB.models.Mask;
    const ServiceHour = DB.models.ServiceHour;
    const response = json.map(async ({
      name,
      cashBalance,
      openingHours,
      masks,
    }: Pharmacy) => {
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
            PharmacyId: pharmacy.id,
          },
          defaults: {
            ...details,
            price,
            PharmacyId: pharmacy.id,
          },
        });
      });

      const bulkDAHCreate = openingHoursParser(openingHours).map((dah) => {
        return ServiceHour.findOrCreate({
          where: {
            ...dah,
            PharmacyId: pharmacy.id,
          },
          defaults: {
            ...dah,
            PharmacyId: pharmacy.id,
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
