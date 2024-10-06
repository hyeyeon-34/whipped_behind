const database = require('../database/database');

exports.findId = async (req, res) => {
    try {
        console.log("FindId request received");
        console.log(req.body);

        const { name, email } = req.body;

        // 데이터베이스에서 사용자 정보 검색
        const { rows } = await database.query(
            'SELECT userid FROM users WHERE name = $1 AND email = $2',
            [name, email]
        );

        if (!rows.length) {
            console.log("User not found");
            return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
        }

        console.log("User found:", rows[0].userid);
        return res.status(200).json({ userId: rows[0].userid });
    } catch (error) {
        console.error("Error during findId:", error.message);
        return res.status(500).json({ error: error.message });
    }
};
