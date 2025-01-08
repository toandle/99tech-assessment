import { Router, Request, Response } from 'express';

import { getList, getDetails, create, update, remove } from '../handlers/product_handler';
import responseHelper from '../helpers/response';
import { asyncHandler } from '../helpers/async_handler';

const route = () => {
  const productRouter = Router();

  productRouter.route('/')
    .get(asyncHandler(async (req: Request, res: Response) => {
      const data = await getList(req);
      return responseHelper(res, data);
    }))
    .post(asyncHandler(async (req: Request, res: Response) => {
      const data = await create(req);
      return responseHelper(res, data);
    }));

  productRouter.route('/:id')
    .get(asyncHandler(async (req: Request, res: Response) => {
      const data = await getDetails(req);
      return responseHelper(res, data);
    }))
    .patch(asyncHandler(async (req: Request, res: Response) => {
      const data = await update(req);
      return responseHelper(res, data);
    }))
    .delete(asyncHandler(async (req: Request, res: Response) => {
      const data = await remove(req);
      return responseHelper(res, data);
    }));

  return productRouter;
};

export default route;