import express from 'express';
import path from 'path';
const app = express();
const viewsRouter = express.Router();
const __dirname = path.resolve();

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// html, css, js 라우팅
app.use(viewsRouter);
console.log(path.join(__dirname + '/public'))
// app.use(express.static(path.join(__dirname + '/public')));


// 페이지별로 html, css, js 파일들을 라우팅함
// 아래와 같이 하면, http://localhost:5000/ 에서는 views/home/home.html 파일을,
// http://localhost:5000/register 에서는 views/register/register.html 파일을 화면에 띄움
viewsRouter.use('/', serveStatic('main', '/'));
// views폴더 내의 ${ resource } 폴더 내의 모든 파일을 웹에 띄우며,
//   이 때 ${ resource }.html 을 기본 파일로 설정함.
//temp값이 undefined 일 때 기본적으로 빈 string 값이 들어간다
function serveStatic(resource, temp = '', pathParam = null) {
  const resourcePath = path.join(__dirname, `./src/views/${temp}/${resource}`);
  const option = { index: `${resource}.html` };

  if (pathParam) {
    option.setHeaders = (res, path, stat) => {
      // Get the value of the path parameter from the request params
      const paramValue = res.req.params[pathParam];
      // Set the path parameter value as a header
      res.set('X-Path-Param', paramValue);
    };
  }

  return express.static(resourcePath, option);
}

export { app };
