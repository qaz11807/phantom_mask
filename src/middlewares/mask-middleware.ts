import DB from '../../models';
import {NextFunction, Request, Response} from 'express';

export const findMaskByPharmacyHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Pharmacy = DB.models.Pharmacy;

    const pharmacyName = req.query.pharmacyName;
    const sort = [];

    if (req.query.sortByName) {
      sort.push(['name', req.query.sortByName]);
    }
    if (req.query.sortByPrice) {
      sort.push(['price', req.query.sortByPrice]);
    }
    const results = await Pharmacy.findMasksByPharmacyName(
      pharmacyName, sort,
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
    const Mask = DB.models.Mask;

    const keyWord = req.query.keyword;
    const colorKeyword = req.query.color;

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
