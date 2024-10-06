const database = require('../database/database');

exports.getProducts = async (req, res) => {
  try {
    const result = await database.query(
      'select product_id,p_main_img,p_name,p_price from product ORDER BY product_id ASC'
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ msg: 'Get Items Fail' + error });
  }
};
