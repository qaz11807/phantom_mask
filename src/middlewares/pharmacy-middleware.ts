import DB from '../../models/';
import {NextFunction, Request, Response} from 'express';

export const findOpeningHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Pharmacy = DB.models.Pharmacy;

    const time = req.query.time;
    const day = req.query.day;

    const results = await Pharmacy.findOpeningPharmacy(
      time, day,
    );

    res.send(results);
  } catch (error) {
    if (error instanceof Error) {
      next(error.message);
    }
  }
};


export const findByPriceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Mask = DB.models.Mask;

    const condition = req.query.condition;
    const limit = req.query.limit;
    const priceRange = [
      req.query.startPrice,
      req.query.endPrice,
    ];

    const results = await Mask.findPharmaciesByPrice(
      condition, limit, priceRange,
    );

    res.send(results);
  } catch (error) {
    if (error instanceof Error) {
      next(error.message);
    }
  }
};
