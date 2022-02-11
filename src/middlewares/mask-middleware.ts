import {NextFunction, Request, Response} from 'express';
import Pharmacy from '../../models/pharmacy.model';
import Mask from '../../models/mask.model';

export const findMaskByPharmacyHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pharmacyName = req.query.pharmacyName as string;
    type SortOrder = 'DESC' | 'ASC';
    const sort: [string, SortOrder][] = [];

    if (req.query.sortByName) {
      sort.push(['name', req.query.sortByName as SortOrder]);
    }
    if (req.query.sortByPrice) {
      sort.push(['price', req.query.sortByPrice as SortOrder]);
    }
    const results = await Pharmacy.getMasksByName(
      pharmacyName,
      sort,
    );

    res.send(results);
  } catch (error) {
    if (error instanceof Error) {
      next(error.message);
    }
  }
};

export const searchRelvantMaskHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const keyWord = req.query.keyword as string;
    const colorKeyword = req.query.color as string;

    const results = await Mask.serachByKeyword(
      keyWord, colorKeyword,
    );

    res.send(results);
  } catch (error) {
    if (error instanceof Error) {
      next(error.message);
    }
  }
};
