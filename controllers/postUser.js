const database = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postUser = async (req, res) => {
  try {
    // 이메일 중복 확인
    const { rows } = await database.query(
      'SELECT id FROM users WHERE email = $1',
      [req.body.email]
    );

    if (rows.length > 0) {
      return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    }

    const salt = 10;
    const hash = await bcrypt.hash(req.body.password, salt);

    const values = [
      req.body.userId,
      hash,
      req.body.name,
      req.body.zonecode || null,
      req.body.fullAddress || null,
      req.body.address || null,
      req.body.phoneIdentify || null,
      req.body.phone1_1 || null,
      req.body.phone1_2 || null,
      req.body.cellphoneIdentify,
      req.body.phone2_1,
      req.body.phone2_2,
      req.body.email,
      req.body.sex,
      req.body.birth,
      req.body.emailIdentify
    ];

    const userResult = await database.query(
      `INSERT INTO users (userId, password, name, zonecode, fullAddress, address, phoneIdentify, phone1_1, phone1_2, 
        cellphoneIdentify, phone2_1, phone2_2, email, sex, birth, emailIdentify) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id`,
      values
    );

    const newUserId = userResult.rows[0].id;
    await database.query(
      'INSERT INTO cart (user_id, created_at) VALUES ($1, CURRENT_TIMESTAMP)',
      [newUserId]
    );
    console.log(req.body)
    return res.status(201).json({ message: 'Account Created Successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};





exports.loginUser = async (req, res) => {
  try {
    console.log("Login request received");
    console.log(req.body)
    
    const { rows } = await database.query(
      'SELECT * FROM users WHERE userid = $1',
      [req.body.userId]
    );

    console.log(rows)
    
    if (!rows.length) {
      console.log("User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    const compare = await bcrypt.compare(req.body.password, rows[0].password);

    if (!compare) {
      console.log("Password not matched");
      return res.status(401).json({ message: 'Password not matched' });
    }

    const id = rows[0].id;
    const name = rows[0].name;
    const email = rows[0].email;
    const userId = rows[0].userid;
    const token = jwt.sign({ id, name, email, userId }, process.env.SECRET_KEY, {
      expiresIn: '1d'
    });

    console.log("Token generated:", token);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true, // 이 부분은 HTTPS 환경에서만 사용, 로컬 개발에서는 false로 설정
    });

    return res.status(201).json({ token: token });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ error: error.message });
  }
};



// ----------
// const pool = require('../database/database'); 
// const bcrypt = require('bcrypt')
// const salt = 10;
// const jwt = require('jsonwebtoken')
// exports.postUser = async (req, res) => {
//     try {
//         const hash = await bcrypt.hash(req.body.password, salt);
//         const values = [req.body.name, req.body.email, hash]
//         await pool.query(
//       'INSERT INTO users (name,email,password) VALUES ($1, $2, $3)',
//       values
//     );
//     return res.status(201).json({ message: 'Account Created Successfully' });
//     } catch (error) {
//       console.error('Error during login:', error);
//       console.log('Database password:', process.env.DB_PASS);
//     return res.status(500).json({ error: error.message });

//     }
// };




// exports.loginUser = async (req, res) => {
//   try {
//     const { Pool } = require('pg');  // 필요할 때만 모듈을 로드
//     const pool = new Pool({ /* 데이터베이스 설정 */ });

//     const { rows } = await pool.query(
//       'SELECT * FROM users WHERE email = $1',
//       [req.body.email]
//     );


//     if (!rows.length) {
//       return res.status(404).json({ message: 'User not found' });
//     }


//     const compare = await bcrypt.compare(req.body.password, rows[0].password);


//     if (!compare) {
//       return res.status(401).json({ message: 'Password not matched' });
//     }


//     const name = rows[0].name;
//     const email = rows[0].email;
//     const token = jwt.sign({ name, email }, process.env.SECRET_KEY, {
//       expiresIn: '1d',
//     }); // 암호화될 데이터, 비밀키, 잔존시간


//     res.cookie('token', token, {
//       httpOnly: true, // 클라이언트에서 쿠키를 자바스크립트로 접근하지 못하게 함
//       sameSite: 'None', // CORS 상황에서 쿠키가 전달될 수 있도록 설정
//     });


//     return res.status(201).json({ token: token });
//   } catch (error) {
//     console.error('Error during login:', error);
//     return res.status(500).json({ error: error.message });
//   }
// };


