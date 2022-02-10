export enum CompareConditions {
  lte = 'lte',
  gte = 'gte',
  lt = 'lt',
  gt = 'gt',
}

export const getFilterFunction = (
  condition: keyof typeof CompareConditions,
  threshold: number,
) => {
  return ({maskCount}: any) => {
    const count = parseInt(maskCount);
    switch (condition) {
    case CompareConditions.gt:
      return count > threshold;
    case CompareConditions.gte:
      return count >= threshold;
    case CompareConditions.lt:
      return count < threshold;
    case CompareConditions.lte:
      return count <= threshold;
    };
  };
};
