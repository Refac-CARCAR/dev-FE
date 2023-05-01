import express from 'express';
import path from 'path';
const __dirname = path.resolve();
const viewsRouter = express.Router();

function serveStatic(resource, dir = '', pathParam = null) {
  const resourcePath = path.join(__dirname, `/views${dir}/${resource}`);
  const option = { index: `${resource}.html` };
  return express.static(resourcePath, option);
}

viewsRouter.use('/', serveStatic('main'));
viewsRouter.use('/product-list', serveStatic('product-list', '/product'));
export default viewsRouter;
