import {NextFunction, Request, Response} from 'express';
import Order from '../../models/order.model';

export const calcPerformanceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dateRange: [Date, Date] = [
      req.query.startDate as unknown as Date,
      req.query.endDate as unknown as Date,
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
    const maskId = req.query.maskId as unknown as number;
    const userId = req.query.userId as unknown as number;

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
