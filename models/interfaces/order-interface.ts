import {
  BelongsToSetAssociationMixin,
  BelongsToGetAssociationMixin,
  Model,
  Optional,
} from 'sequelize';
import MaskInstance from './mask-interface';
import PharmacyInstance from './pharmacy-interface';
import UserInstance from './user-interface';

interface OrderAttributes {
  id: number;
  transactionAmount: number;
  transactionDate: Date
}

interface OrderCreationAttributes extends Optional<
  OrderAttributes, 'id'
> {}

/* eslint-disable */
export default interface OrderInstance extends Model<OrderAttributes, OrderCreationAttributes>, OrderCreationAttributes {
  pharmacy: PharmacyInstance;
  getPharmacy: BelongsToGetAssociationMixin<PharmacyInstance>;
  setPharmacy: BelongsToSetAssociationMixin<PharmacyInstance, 'id'>;

  masks: MaskInstance;
  getMask: BelongsToGetAssociationMixin<MaskInstance>;
  setMask: BelongsToSetAssociationMixin<MaskInstance, 'id'>;

  user: UserInstance;
  getUser: BelongsToGetAssociationMixin<UserInstance>;
  setUser: BelongsToSetAssociationMixin<UserInstance, 'id'>;

}
