import {
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
  Optional,
} from 'sequelize';
import MaskInstance from './mask-interface';
import OrderInstance from './order-interface';
import ServiceHourInstance from './serviceHours-interface';

interface PharmacyAttributes {
  id: number;
  name: string ;
  cashBalance: number;
}

interface PharmacyCreationAttributes extends Optional<
  PharmacyAttributes, 'id'
> {}

/* eslint-disable */
export default interface  PharmacyInstance extends Model<PharmacyAttributes, PharmacyCreationAttributes>, PharmacyCreationAttributes {
  
  serviceHours: ServiceHourInstance[];
  getServiceHours: HasManyGetAssociationsMixin<ServiceHourInstance>;
  createServiceHour: HasManyCreateAssociationMixin<ServiceHourInstance>;
  
  orders: ServiceHourInstance[];
  getOrders: HasManyGetAssociationsMixin<OrderInstance>;
  
  masks: MaskInstance[];
  getMasks: HasManyGetAssociationsMixin<MaskInstance>;
  createMask: HasManyCreateAssociationMixin<MaskInstance>;
}
