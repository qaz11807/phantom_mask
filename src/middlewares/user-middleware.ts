import DB from '../../models';
import {NextFunction, Request, Response} from 'express';

export const findTopSalesUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Order = DB.models.Order;

    const limit = req.query.limit;
    const dateRange = [
      req.query.startDate,
      req.query.endDate,
    ];

    const results = await Order.findTopTranscationUser(
      limit, dateRange,
    );

    res.send(results);
  } catch (error) {
    if (error instanceof Error) {
      next(error.message);
    }
  }
};
