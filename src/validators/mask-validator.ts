import {query} from 'express-validator';

export default {
  findMaskByPharmacy: [
    query('pharmacyName')
      .isAlphanumeric('en-US', {ignore: ' '})
      .trim()
      .exists(),
    query('sortByName')
      .trim()
      .toUpperCase()
      .isIn(['ASC', 'DESC'])
      .optional(),
    query('sortByPrice')
      .trim()
      .toUpperCase()
      .isIn(['ASC', 'DESC'])
      .optional(),
  ],
  searchRelvantMask: [
    query('keyword')
      .isAlphanumeric('en-US', {ignore: ' '})
      .trim()
      .toLowerCase()
      .exists(),
    query('color')
      .isAlphanumeric('en-US', {ignore: ' '})
      .trim()
      .toLowerCase()
      .optional(),
  ],
};
