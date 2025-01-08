import { Router } from 'express';
import productRouter from './product_router';

const route = () => {
  const router: Router = Router();
  router.use('/products', productRouter());

  return router;
}

export default route;