import User from '../../models/user.model';
import Pharmacy from '../../models/pharmacy.model';
import {maskParser} from '../../utils/parser';
import Order from '../../models/order.model';

interface OrderData {
  maskName: string
  pharmacyName: string
  transactionDate: string
  transactionAmount: number
}

interface UserData {
  name: string
  cashBalance: number
  purchaseHistories: OrderData[]
}

export default async (json: UserData[])=>{
  try {
    const response = json.map(async ({
      name,
      cashBalance,
      purchaseHistories,
    }: UserData) => {
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
        const masks = await pharmacy.$get('masks', {
          where: {
            ...detailed,
          },
        });
        const mask = masks[0];

        if (!mask) {
          throw new Error('Mask not exist!');
        }

        return await Order.create({
          transactionDate: new Date(transactionDate),
          transactionAmount,
          maskId: mask.id,
          pharmacyId: pharmacy.id,
          userId: user.id,
        });
      });
      return Promise.all(bulkOrderCreate);
    });
    await Promise.all(response);
  } catch (err) {
    throw err;
  }
};


