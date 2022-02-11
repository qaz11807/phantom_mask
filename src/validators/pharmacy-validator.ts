import {query} from 'express-validator';
import {Days} from '../../models/serviceHour.model';
import {isTime} from '../../utils/busy';

export default {
  findOpening: [
    query('time')
      .exists()
      .custom((value) => isTime(value))
      .withMessage('must be xx:xx format'),
    query('day')
      .trim()
      .toLowerCase()
      .isIn(Object.keys(Days))
      .optional(),
  ],
  findByPrice: [
    query('condition')
      .trim()
      .toLowerCase()
      .isIn(['lte', 'gte', 'lt', 'gt'])
      .exists(),
    query('limit')
      .isNumeric()
      .toInt()
      .exists(),
    query('startPrice')
      .isNumeric()
      .toInt()
      .optional(),
    query('endPrice')
      .isNumeric()
      .toInt()
      .optional(),
  ],
};
