import {
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
  Model,
  Optional,
} from 'sequelize';
import OrderInstance from './order-interface';

interface UserAttributes {
  id: number;
  name: string ;
  cashBalance: number;
}

interface UserCreationAttributes extends Optional<
  UserAttributes, 'id'
> {}

/* eslint-disable */
export default interface  UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserCreationAttributes {
  orders: OrderInstance[];
  getOrders: HasManyGetAssociationsMixin<OrderInstance>;
  createOrder: HasManyCreateAssociationMixin<OrderInstance>;
}
