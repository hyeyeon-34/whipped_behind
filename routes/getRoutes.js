const router = require('express').Router(); // api path를 전달해 주는 메서드

const { getDetailproduct, getProduct } = require('../controllers/getDetailproduct');
const { getProducts } = require('../controllers/getProducts');
const { getCart } = require('../controllers/getCart');
const { eachPurchase } = require('../controllers/eachPurchase');
const { getAnnouncement, getComminityDetail } = require('../controllers/getCommunitycontents');




router.get('/get_products/', getProducts);
router.get('/get_detail_products/:productId', getDetailproduct);
router.get('/get_cart/:userId', getCart);
router.get('/get_product/', getProduct)
router.get('/each_purchase/:userId', eachPurchase );
router.get('/community_announcement/', getAnnouncement );
router.get('/community_detail/:write_number', getComminityDetail);


module.exports = router; // router 변수를 모듈로 사용할 수 있도록 설정
