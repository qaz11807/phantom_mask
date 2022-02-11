import {NextFunction, Request, Response} from 'express';
import User from '../../models/user.model';

export const findTopSalesUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = req.query.limit as unknown as number;
    const dateRange: [Date, Date]= [
      req.query.startDate as unknown as Date,
      req.query.endDate as unknown as Date,
    ];

    const results = await User.findTopTranscation(
      limit, dateRange,
    );

    res.send(results);
  } catch (error) {
    if (error instanceof Error) {
      next(error.message);
    }
  }
};
