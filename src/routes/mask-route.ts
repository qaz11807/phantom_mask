import {Route} from './route';
import {schemaGetter} from '../middlewares/validator-middleware';

/** middleware imported */
import * as Api from '../middlewares/mask-middleware';

/** api request validator */
import Validator from '../validators/mask-validator';

/** Class representing Mask Route. */
class MaskRoute extends Route {
  /**
   * Create a routes.
   * @param {string} basePrefix
   */
  constructor(basePrefix?: string) {
    super(basePrefix);
    this.prefix += '/mask';
    this.setRoutes();
  }
  /**
   * Set the router's routes and middleware.
   */
  protected setRoutes() {
    this.router.get(
      '/relevant',
      schemaGetter(Validator.searchRelvantMask),
      Api.searchRelvantMaskHandler,
    );

    this.router.get(
      '/',
      schemaGetter(Validator.findMaskByPharmacy),
      Api.findMaskByPharmacyHandler,
    );
  }
}

export default MaskRoute;
