import express from 'express';
import path from 'path';
const __dirname = path.resolve();
const viewsRouter = express.Router();

function serveStatic(resource, dir = '', pathParam = null) {
  const resourcePath = path.join(__dirname, `/views${dir}/${resource}`);
  const option = { index: `${resource}.html` };
  if (pathParam) {
    option.setHeaders = (res, path, stat) => {
      // Get the value of the path parameter from the request params
      const paramValue = res.req.params[pathParam];
      // Set the path parameter value as a header
      res.set('X-Path-Param', paramValue);
    };
  }
  //저희팀 FE코드 app.js에서 가져왔습니다
  return express.static(resourcePath, option);
}

viewsRouter.use('/', serveStatic('main'));
viewsRouter.use('/product-list', serveStatic('product-list', '/product'));
viewsRouter.use('/product/:id', serveStatic('product-detail', '/product', 'id'));
viewsRouter.use('/cart', serveStatic('cart'));
//라우터를 추가하였습니다.

export default viewsRouter;
