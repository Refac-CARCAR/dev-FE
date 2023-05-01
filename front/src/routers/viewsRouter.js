import express from 'express';
import path from 'path';

const __dirname = path.resolve();
const viewsRouter = express.Router();

function serveStatic(resource, dir = '', pathParam = null) {
  const resourcePath = path.join(__dirname, `/views${dir}/${resource}`);
  const option = { index: `${resource}.html` };
  // express.static() - 정적 자산이 포함된 디렉토리의 이름을 전달하면 전달된 디렉토리 내의 파일의 직접적인 제공 시작. 파일이 없으면 404가 아닌 오류처리 미들웨어 next() 동작
  return express.static(resourcePath, option);
}

viewsRouter.use('/', serveStatic('main'));
viewsRouter.use('/product-list', serveStatic('product-list', '/product'));
export default viewsRouter;
