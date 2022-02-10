import {Route} from './route';
import {schemaGetter} from '../middlewares/validator-middleware';

/** middleware imported */
import * as Api from '../middlewares/user-middleware';

/** api request validator */
import Validator from '../validators/user-validator';

/** Class representing User Route. */
class UserRoute extends Route {
  /**
   * Create a routes.
   * @param {string} basePrefix
   */
  constructor(basePrefix?: string) {
    super(basePrefix);
    this.prefix += '/user';
    this.setRoutes();
  }
  /**
   * Set the router's routes and middleware.
   */
  protected setRoutes() {
    this.router.get(
      '/top',
      schemaGetter(Validator.findTopSalesUser),
      Api.findTopSalesUserHandler,
    );
  }
}

export default UserRoute;
