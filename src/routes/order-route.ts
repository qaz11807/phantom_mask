import {Route} from './route';
import {schemaGetter} from '../middlewares/validator-middleware';

/** middleware imported */
import * as Api from '../middlewares/order-middleware';

/** api request validator */
import Validator from '../validators/order-validator';

/** Class representing Order Route. */
class OrderRoute extends Route {
  /**
   * Create a routes.
   * @param {string} basePrefix
   */
  constructor(basePrefix?: string) {
    super(basePrefix);
    this.prefix += '/order';
    this.setRoutes();
  }
  /**
   * Set the router's routes and middleware.
   */
  protected setRoutes() {
    this.router.get(
      '/performance',
      schemaGetter(Validator.calcPerformance),
      Api.calcPerformanceHandler,
    );
    this.router.post(
      '/',
      schemaGetter(Validator.makeOrder),
      Api.makeOrder,
    );
  }
}

export default OrderRoute;
