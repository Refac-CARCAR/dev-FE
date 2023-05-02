import express from 'express';
import path from 'path';
import cors from 'cors';
import viewsRouter from './routers/viewsRouter.js';
/** CWD(current working directory)의 절대경로 */
const __dirname = path.resolve(); // src??

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'views')));
app.use(viewsRouter);
// CORS 에러 방지
app.use(cors());
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.listen(3001, () => {
  console.log('http://localhost:3001')
})

export { app };
