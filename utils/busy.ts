export const isTime = (time: string) => {
  return /[0-9]{2}:[0-9]{2}/gm.test(time);
};
