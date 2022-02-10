import {query} from 'express-validator';

export default {
  findTopSalesUser: [
    query('limit')
      .isNumeric()
      .toInt()
      .exists(),
    query('startDate')
      .isDate()
      .toDate()
      .optional(),
    query('endDate')
      .isDate()
      .toDate()
      .optional(),
  ],
};
