import {BelongsToGetAssociationMixin, Model, Optional} from 'sequelize';
import PharmacyInstance from './pharmacy-interface';

export enum Days{
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat'
}

interface ServiceHourAttributes {
  id: number;
  dayOfOpen: number
  openTime: Date
  dayOfClose: number
  closeTime: Date
}

interface ServiceHourCreationAttributes extends Optional<
  ServiceHourAttributes, 'id'
> {}

/* eslint-disable */
export default interface ServiceHourInstance extends Model<ServiceHourAttributes, ServiceHourCreationAttributes>, ServiceHourCreationAttributes {
  pharmacy: PharmacyInstance;
  getPharmacy: BelongsToGetAssociationMixin<PharmacyInstance>;
}
