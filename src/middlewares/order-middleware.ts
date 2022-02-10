import DB from '../../models';
import {NextFunction, Request, Response} from 'express';

export const calcPerformanceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Order = DB.models.Order;

    const dateRange = [
      req.query.startDate,
      req.query.endDate,
    ];

    const results = await Order.calcSalesPerformanceByDate(
      dateRange,
    );

    res.send(results);
  } catch (error) {
    if (error instanceof Error) {
      next(error.message);
    }
  }
};


export const makeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Order = DB.models.Order;

    const maskId = req.query.maskId;
    const userId = req.query.userId;

    const results = await Order.makeOrder(
      maskId, userId,
    );

    res.send(results);
  } catch (error) {
    if (error instanceof Error) {
      next(error.message);
    }
  }
};
