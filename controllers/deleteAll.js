const database = require('../database/database');

exports.deleteAll = async (req, res) => {
    const {userId} = req.params;


    try {
        const cartResult = await database.query('SELECT cart_id FROM cart WHERE user_id = $1', [userId]);

        if (cartResult.rows.length === 0){
            return res.status(404).json({ error: 'Cart not found for this user' });
        }
        const cartId = cartResult.rows[0].cart_id;
        
        const deleteResult = await database.query(
            'DELETE FROM Cartitem WHERE cart_id = $1', [cartId]
        )

        if(deleteResult.rowCount === 0){
            return res.status(404).json({ error : 'No deletion was made'})
        }
        return res.status(200).json({ message: 'All cart items deleted successfully' });
    } catch (error) {
        console.log('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
    }
}