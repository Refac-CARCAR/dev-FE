import express from 'express';
import path from 'path';
import cors from 'cors';
import viewsRouter from './routers/viewsRouter.js';
/** CWD(current working directory)의 절대경로 */
const __dirname = path.resolve(); // src??
// https://nodejs.org/docs/latest/api/path.html#pathresolvepaths
// 'If no path segments are passed, path.resolve() will return the absolute path of the current working directory.'
// 절대 경로 = 파일의 root부터 해당 파일까지의 전체 경로(URL)
// 보통 다른 사람의 문서나 파일을 이용할 때 사용
// 어느 곳에서나 접근할 수 있지만 경로변경 시 일일히 수정해야 함
// 상대 경로 = 현재 파일을 기준으로 연결하려는 파일의 상대적인 경로를 적는 것.

const app = express();

// view 폴더에 있는 정적 파일을 사용하기 위한 코드: app.use(express.static('views'))
// path.join(__dirname, 'views')는 무엇일까? -> CWD는 (src폴더 내 app.js) -> ./views 
// ./views(CWD인 src폴더 내의 view 폴더)의 static files를 이용하겠다!! 라는 의미
app.use(express.static(path.join(__dirname, 'views')));

app.use(viewsRouter);
// CORS 에러 방지
app.use(cors());

// 무엇을 위한 코드인 지 유빈님께 물어보기
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.listen(3001, () => {
  console.log('http://localhost:3001')
})

export { app };
