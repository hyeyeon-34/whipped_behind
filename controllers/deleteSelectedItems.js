const database = require('../database/database');

exports.deleteSelectedItems = async (req, res) => {
  const { userId } = req.params;
  const { items } = req.body; // items 배열에는 삭제할 productId, productSize, cartItemId 정보들이 들어있습니다.

  try {
    const cartResult = await database.query('SELECT cart_id FROM Cart WHERE user_id = $1', [userId]);

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found for this user' });
    }

    const cartId = cartResult.rows[0].cart_id;

    for (const item of items) {
      const { productId, productSize, cartItemId } = item;

      // DIY 아이템 삭제 로직 (productSize가 null 또는 undefined이고 cartItemId가 제공된 경우)
      if ((productSize === null || productSize === undefined) && cartItemId) {
        console.log('Deleting DIY item:', cartId, cartItemId);
        
        const deleteResult = await database.query(
          'DELETE FROM CartItem WHERE cart_id = $1 AND cart_item_id = $2',
          [cartId, cartItemId]
        );

        if (deleteResult.rowCount === 0) {
          return res.status(404).json({ error: `DIY CartItem not found for cartItemId ${cartItemId}` });
        }
      } else {
        // 일반 아이템 삭제 로직
        console.log('Deleting regular item:', productId, productSize);
        
        const deleteResult = await database.query(
          'DELETE FROM CartItem WHERE product_id = $1 AND cart_id = $2 AND product_size = $3',
          [productId, cartId, productSize]
        );

        if (deleteResult.rowCount === 0) {
          return res.status(404).json({ error: `CartItem not found for productId ${productId} and productSize ${productSize}` });
        }
      }
    }

    res.status(200).json({ message: 'Selected items deleted successfully' });
  } catch (error) {
    console.log('Error deleting items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
