import {Route} from './route';
import PharnacyRoute from './pharmacy-route';
import MaskRoute from './mask-route';
import UserRoute from './user-route';
import OrderRoute from './order-route';

export const routers: Array<Route> = [
  new PharnacyRoute(),
  new MaskRoute(),
  new UserRoute(),
  new OrderRoute(),
];
