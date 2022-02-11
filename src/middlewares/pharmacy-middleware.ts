import {NextFunction, Request, Response} from 'express';
import Pharmacy from '../../models/pharmacy.model';
import {CompareConditions} from '../../utils/filter-helper';

export const findOpeningHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const time = req.query.time as string;
    const day = req.query.day as unknown as number;

    const results = await Pharmacy.findOpening(
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
    const condition = req.query.condition as CompareConditions;
    const limit = req.query.limit as unknown as number;
    const priceRange: [number, number] = [
      req.query.startPrice as unknown as number,
      req.query.endPrice as unknown as number,
    ];

    const results = await Pharmacy.findByPrice(
      condition, limit, priceRange,
    );

    res.send(results);
  } catch (error) {
    if (error instanceof Error) {
      next(error.message);
    }
  }
};
