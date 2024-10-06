const database = require('../database/database');

exports.deleteItem = async (req, res) => {
  const { userId } = req.params;
  const { productId, productSize, cartItemId } = req.body;
 
  try {
    const cartResult = await database.query('SELECT cart_id FROM Cart WHERE user_id = $1', [userId]);

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found for this user' });
    }

    const cartId = cartResult.rows[0].cart_id;
    console.log('Received data:', { productId, productSize, cartItemId });
    if ((productSize === null || productSize === undefined) && cartItemId) {
      console.log('DIY Item deletion:', cartId, cartItemId);
      // DIY 아이템 삭제 (productSize가 null이고 cartItemId가 제공된 경우)
      const deleteResult = await database.query(
        'DELETE FROM CartItem WHERE cart_id = $1 AND cart_item_id = $2',
        [cartId, cartItemId]
        
      );
      
      if (deleteResult.rowCount === 0) {
        return res.status(404).json({ error: 'DIY CartItem not found or no deletion was made' });

      }
      
    } else {
      // 일반 아이템 삭제
     
      const deleteResult = await database.query(
        'DELETE FROM CartItem WHERE product_id = $1 AND cart_id = $2 AND product_size = $3',
        [productId, cartId, productSize]
      );
     
      if (deleteResult.rowCount === 0) {
        return res.status(404).json({ error: 'CartItem not found or no deletion was made' });
      }
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.log('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

          
    