const express = require('express'); // express 모듈 불러오기
const cors = require('cors'); // cors 모듈 불러오기
const PORT = 8010; // 포트 설정

const app = express(); // express 모듈을 사용하기 위해 app 변수에 할당

app.use(cors()); // cors 사용 설정 http, https 프로토콜을 사용하는 서버간의 통신을 허용한다
app.use(express.json()); // json 형식 사용 설정

// app.use(cors({
//   origin : "http://localhost:3000",
//   credentials : true,
// })); // http, https 프로토콜을 사용하는 서버 간의 통신을 허용한다.

const corsOptions = {
  origin: 'https://whippedf4.hyee34.site', // 클라이언트의 주소를 명시
  credentials: true, // 자격 증명 허용
};

app.use(cors(corsOptions));



app.get('/', (req, res) => {
  res.send('Hello World! please'); // get 요청 시 Hello World! 출력
}); // get 요청 시 실행할 함수




app.use(require('./routes/getRoutes'));

app.use(require('./routes/postRoutes'))

const path = require('path')
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.listen(PORT, () => console.log(`Server is runnig on ${PORT}`)); // 서버 실행 시 메세지 출력
