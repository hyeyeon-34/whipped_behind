const database = require('../database/database');

exports.eachPurchase = async (req, res) =>{
    const {userId} = req.params;
    try {
        const cartResult = await database.query('SELECT cart_id FROM cart WHERE user_id = $1', [userId]);

        if (cartResult.rows.length === 0) {
            return res.status(404).json({eclerror : 'Cart not found for this user'});
        }
        
        const cartId = cartResult.rows[0].cart_id;

        const itemsResult = await database.query ('SELECT * FROM cartitem WHERE cart_id = $1', [cartId]);

        if (itemsResult.rows.length === 0){
            return res.status(404).json({eclerror : 'Items not found for this user'})
        }

        const productId = itemsResult.rows[0].product_id;
        const productSize = itemsResult.rows[0].product_size;

        const purchaseResult = await database.query('SELECT * FROM cartitem WHERE product_id = $1 AND product_size = $2', [productId, productSize])

        res.json(purchaseResult.rows)
    } catch (error) {
        console.error('Error fetching Each Item : ', error);
        res.status(500).json({ error : 'Internal server error'})
    }
}