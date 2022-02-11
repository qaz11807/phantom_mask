import {
  Model,
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import Pharmacy from './pharmacy.model';

export enum Days{
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat'
}

@Table({
  tableName: 'ServiceHours',
})
/**
 *
 */
export default class ServiceHour extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column(DataType.INTEGER)
  declare dayOfOpen: number;

  @Column(DataType.TIME)
  declare openTime: Date;

  @Column(DataType.INTEGER)
  declare dayOfClose: number;

  @Column(DataType.TIME)
  declare closeTime: Date;

  @ForeignKey(() => Pharmacy)
  @Column
  declare pharmacyId: number;

  /** Asscoiations */
  @BelongsTo(() => Pharmacy)
  declare pharmacy: Pharmacy;
}
