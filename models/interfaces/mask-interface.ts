import {
  BelongsToGetAssociationMixin,
  HasManyCreateAssociationMixin,
  Model,
  Optional,
} from 'sequelize';
import OrderInstance from './order-interface';
import PharmacyInstance from './pharmacy-interface';

interface MaskAttributes {
  id: number;
  name: string ;
  pack: number;
  color: string;
  price: number;
}

interface MaskCreationAttributes extends Optional<
  MaskAttributes, 'id'
> {}

/* eslint-disable */
export default interface  MaskInstance extends Model<MaskAttributes, MaskCreationAttributes>, MaskCreationAttributes {
  pharmacys: PharmacyInstance;
  getPharmacys: BelongsToGetAssociationMixin<PharmacyInstance>;

  orders: OrderInstance[];
  getOrders: HasManyCreateAssociationMixin<OrderInstance>;
}
