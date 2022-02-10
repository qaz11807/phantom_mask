import {Route} from './route';
import {schemaGetter} from '../middlewares/validator-middleware';

/** middleware imported */
import * as Api from '../middlewares/pharmacy-middleware';

/** api request validator */
import Validator from '../validators/pharmacy-validator';

/** Class representing Pharmacy Route. */
class PharmacyRoute extends Route {
  /**
   * Create a routes.
   * @param {string} basePrefix
   */
  constructor(basePrefix?: string) {
    super(basePrefix);
    this.prefix += '/pharmacy';
    this.setRoutes();
  }
  /**
   * Set the router's routes and middleware.
   */
  protected setRoutes() {
    this.router.get(
      '/opening',
      schemaGetter(Validator.findOpening),
      Api.findOpeningHandler,
    );

    this.router.get(
      '/',
      schemaGetter(Validator.findByPrice),
      Api.findByPriceHandler,
    );
  }
}

export default PharmacyRoute;
