import DB from '../../models';
import {maskParser} from '../../utils/parser';

interface Order {
  maskName: string
  pharmacyName: string
  transactionDate: string
  transactionAmount: number
}

interface User {
  name: string
  cashBalance: number
  purchaseHistories: Order[]
}

export default async (json: User[])=>{
  try {
    const User = DB.models.User;
    const Pharmacy = DB.models.Pharmacy;
    const response = json.map(async ({
      name,
      cashBalance,
      purchaseHistories,
    }: User) => {
      const [user] = await User.findOrCreate({
        where: {
          name: name,
        },
        defaults: {
          name: name,
          cashBalance: cashBalance,
        },
      });

      if (!user) {
        return;
      }

      const bulkOrderCreate = purchaseHistories.map(async ({
        pharmacyName,
        maskName,
        transactionAmount,
        transactionDate,
      }) => {
        const pharmacy = await Pharmacy.findOne({
          where: {
            name: pharmacyName,
          },
        });

        if (!pharmacy) {
          throw new Error('Pharmacy not exist!');
        }

        const detailed = maskParser(maskName);
        const mask = await Pharmacy.getMask(pharmacy, detailed);

        if (!mask) {
          throw new Error('Mask not exist!');
        }

        return await user.createOrder({
          transactionDate: new Date(transactionDate),
          transactionAmount,
          MaskId: mask.id,
          PharmacyId: pharmacy.id,
          UserId: user.id,
        });
      });
      return Promise.all(bulkOrderCreate);
    });
    await Promise.all(response);
  } catch (err) {
    throw err;
  }
};


