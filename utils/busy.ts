import {Days} from '../models/serviceHour.model';

export const isTime = (time: string) => {
  return /[0-9]{2}:[0-9]{2}/gm.test(time);
};

export const safeDayCreate = (dayOfweek?: number) => {
  let day = dayOfweek;
  if (day !== undefined) {
    if (!(day in Days)) {
      throw new Error('Day format error!');
    }
    if (typeof day === 'string') {
      if (!isNaN(parseInt(day))) {
        day = parseInt(day);
      } else {
        day = Days[day as keyof typeof Days];
      }
    }
  }
  return day;
};
