import {Days} from '../models/serviceHour.model';

export const openingHoursParser = (str: string) => {
  const formatted = str.toLowerCase().split('/');
  const dayAndHours = formatted.map((s)=>s.trim().split(' '));
  return dayAndHours.map((dah)=>{
    return serviceHoursParser(dah);
  }).flat();
};

const serviceHoursParser = (cell: string[]) => {
  const days:string[] = [];
  const hours:string[] = [];
  let multi = false;
  for (let i=0; i < cell.length; i++) {
    if (cell[i].indexOf('-') !== -1) {

    } else if (cell[i].indexOf(',') !== -1) {
      multi = true;
      days.push(cell[i].split(',')[0]);
    } else if (isLetter(cell[i])) {
      days.push(cell[i]);
    } else {
      hours.push(cell[i]);
    }
  }
  const offset = isTwoDay(hours[0], hours[1]) ? 1 : 0;
  if (multi) {
    return days.map((day)=>{
      return {
        dayOfOpen: Days[day as keyof typeof Days],
        openTime: hours[0],
        dayOfClose: Days[day as keyof typeof Days] + offset,
        closeTime: hours[1],
      };
    });
  } else {
    const startDay = days[0];
    const endDay = days[1] ? days[1] : days[0];
    return [{
      dayOfOpen: Days[startDay as keyof typeof Days],
      openTime: hours[0],
      dayOfClose: Days[endDay as keyof typeof Days] + offset,
      closeTime: hours[1],
    }];
  }
};

/**
 * check the string is a letter.
 * @param {string} str
 * @return {bool}
 */
function isLetter(str: string) {
  return str.toLowerCase() != str.toUpperCase();
}

/**
 * check the time range is over two days.
 * @param {string} start
 * @param {string} end
 * @return {boolean}
 */
function isTwoDay(start: string, end: string) {
  const t1 = start.split(':');
  const t2 = end.split(':');
  if (parseInt(t1[0]) >= parseInt(t2[0])) {
    if ((parseInt(t1[0]) === parseInt(t2[0]))) {
      return (parseInt(t1[1]) === parseInt(t2[1]));
    } else {
      return true;
    }
  } else {
    return false;
  }
}

const regex1 = /\(.*?\)/gm;
const regexLetter = /[a-zA-Z]+/gm;
const regexNumber = /[0-9]+/gm;

export const maskParser = (str: string) => {
  const maskName = str.split(regex1)[0].trim();
  const details = str.match(regex1);
  let maskColor;
  let maskPack;
  if (details) {
    maskColor = details[0].match(regexLetter);
    maskPack = details[1].match(regexNumber);
  }
  if (!maskColor || !maskPack) {
    throw new Error('Mask data formatted error');
  }
  return {
    name: maskName,
    color: maskColor[0],
    pack: parseInt(maskPack[0]),
  };
};
