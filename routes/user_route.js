const router = require('express').Router();
const UserController = require('../controller/user_controller');

router.post('/registration', UserController.register);
router.post('/login', UserController.login);
router.post('/locationupdate', UserController.locationUpdate);
router.post('/userupdate', UserController.userupdate);
router.post('/tagUpdate', UserController.tagUpdate);
router.post('/nearbyUsers', UserController.nearbyUsers);

module.exports = router;
