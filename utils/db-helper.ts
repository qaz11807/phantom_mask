import {FindOptions, Op} from 'sequelize';

interface Pagenation{
  page: number;
  pageSize: number;
}

export const paginate = (
  {page, pageSize} : Pagenation,
  query?: FindOptions,
) => {
  const limit = !Number.isNaN(pageSize) ? pageSize : 10;
  const offset = !Number.isNaN(page) ? (page - 1) * limit : 0;

  return {
    ...query,
    offset,
    limit,
  };
};

export const safeRangeCreator = <T>(
  key: string,
  range?: [T, T],
) => {
  let operator;
  if (range) {
    const [start, end] = range;
    if (start !== undefined && end !== undefined) {
      operator = {
        [Op.between]: range,
      };
    } else if (start !== undefined) {
      operator = {
        [Op.gte]: start,
      };
    } else if (end !== undefined) {
      operator = {
        [Op.lte]: end,
      };
    }
    if (operator) {
      return {
        [key]: operator,
      };
    }
  }
};

