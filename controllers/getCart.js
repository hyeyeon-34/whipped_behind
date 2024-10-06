const database = require('../database/database');

// exports.getCart = async (req, res) => {
//   const {userId} = req.params;
//   try {
 
//     const cartResult = await database.query('SELECT cart_id FROM Cart WHERE user_id = $1', [userId]);

//     if (cartResult.rows.length === 0) {
//       return res.status(404).json({ eclerror: 'Cart not found for this user' });
//     }

//     const cartId = cartResult.rows[0].cart_id;

    
//     const itemsResult = await database.query('SELECT * FROM CartItem WHERE cart_id = $1', [cartId]);

//     res.json(itemsResult.rows);
//   } catch (error) {
//     console.error('Error fetching cart items:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
exports.getCart = async (req, res) => {
  const { userId } = req.params;
  
  try {
    // 장바구니 ID를 가져옵니다.
    const cartResult = await database.query('SELECT cart_id FROM Cart WHERE user_id = $1', [userId]);

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found for this user' });
    }

    const cartId = cartResult.rows[0].cart_id;

    // 일반 장바구니 아이템을 가져옵니다.
    const itemsResult = await database.query('SELECT * FROM CartItem WHERE cart_id = $1 AND is_bundle = false', [cartId]);

    // DIY 아이템을 가져옵니다.
    const diyItemsResult = await database.query('SELECT * FROM CartItem WHERE cart_id = $1 AND is_bundle = true', [cartId]);

    // 장바구니 아이템과 DIY 아이템을 함께 응답으로 보냅니다.
    res.json({
      cartItems: itemsResult.rows,
      diyItems: diyItemsResult.rows
    });
      console.log("됐나");
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// exports.decreaseQuantity = async (req, res) => {
//   const { userId } = req.params;
//   const { productId, newQuantity, productSize } = req.body;  // 이 부분에서 newQuantity와 productId를 받아옴

//   try {
//     console.log('Received request for user:', req.params.userId); 
//     // console.log(req.body);
//     // 사용자 장바구니 ID 가져오기
//     const cartResult = await database.query('SELECT cart_id FROM Cart WHERE user_id = $1', [userId]);

//     if (cartResult.rows.length === 0) {
//       return res.status(404).json({ error: 'Cart not found for this user' });
//     }
//     const cartId = cartResult.rows[0].cart_id;
//     const isDiyProduct = productSize === null;
//     if (isDiyProduct) {
//       // DIY 제품의 수량 업데이트
//       const updateResult = await database.query(
//         'UPDATE CartItem SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 AND is_bundle = true',
//         [newQuantity, cartId, productId]
//       );
//     // CartItem의 수량 업데이트
//     if (updateResult.rowCount === 0) {
//       return res.status(404).json({ error: 'DIY CartItem not found or no update was made' });
//     }
//   } else {
//     // 일반 제품의 수량 업데이트
//     const updateResult = await database.query(
//       'UPDATE CartItem SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 AND product_size = $4',
//       [newQuantity, cartId, productId, productSize]
//     );

//     if (updateResult.rowCount === 0) {
//       return res.status(404).json({ error: 'CartItem not found or no update was made' });
//     }
//   }

//   res.json({ message: 'Quantity updated successfully' });
// } catch (error) {
//   console.log('Error updating quantity:', error);
//   res.status(500).json({ error: 'Internal server error' });
// }
// };
exports.decreaseQuantity = async (req, res) => {
  const { userId } = req.params;
  const { cartItemId, productId, newQuantity, productSize } = req.body;

  try {
    console.log('Received request for user:', userId);

    // 사용자 장바구니 ID 가져오기
    const cartResult = await database.query('SELECT cart_id FROM Cart WHERE user_id = $1', [userId]);

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found for this user' });
    }
    const cartId = cartResult.rows[0].cart_id;

    if (cartItemId) {
      // DIY 제품 또는 단일 제품의 수량 업데이트 (cartItemId로 식별)
      const updateResult = await database.query(
        'UPDATE CartItem SET quantity = $1 WHERE cart_id = $2 AND cart_item_id = $3',
        [newQuantity, cartId, cartItemId]
      );

      if (updateResult.rowCount === 0) {
        return res.status(404).json({ error: 'CartItem not found or no update was made' });
      }
    } else {
      // 일반 제품의 수량 업데이트
      const updateResult = await database.query(
        'UPDATE CartItem SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 AND product_size = $4',
        [newQuantity, cartId, productId, productSize]
      );

      if (updateResult.rowCount === 0) {
        return res.status(404).json({ error: 'CartItem not found or no update was made' });
      }
    }

    res.json({ message: 'Quantity updated successfully' });
  } catch (error) {
    console.log('Error updating quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




exports.updateItemQuantity = async (req, res) => {
  const { userId } = req.params;
  const { product_id, quantity, product_size } = req.body;  // product_id와 quantity를 받아옴

  try {
    console.log('Received request for user:', userId); 
    console.log(req.body);

    // 사용자 장바구니 ID 가져오기
    const cartResult = await database.query('SELECT cart_id FROM Cart WHERE user_id = $1', [userId]);

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found for this user' });
    }
    const cartId = cartResult.rows[0].cart_id;

    // CartItem의 수량 업데이트
    const updateResult = await database.query(
      'UPDATE CartItem SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 AND product_size = $4',
      [quantity, cartId, product_id, product_size]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'CartItem not found or no update was made' });
    }

    res.json({ message: 'Quantity updated successfully' });
  } catch (error) {
    console.log('Error updating quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




