import {query} from 'express-validator';

export default {
  calcPerformance: [
    query('startDate')
      .isDate()
      .toDate()
      .optional(),
    query('endDate')
      .isDate()
      .toDate()
      .optional(),
  ],
  makeOrder: [
    query('maskId')
      .isNumeric()
      .toInt()
      .exists(),
    query('userId')
      .isNumeric()
      .toInt()
      .exists(),
  ],
};
