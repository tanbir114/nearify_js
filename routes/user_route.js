const router = require("express").Router();
const UserController = require("../controller/user_controller");
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const absolutePath = path.resolve(__dirname, '../data/uploads');
    cb(null, absolutePath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".jpg");
  },
});

const upload = multer({
  storage: storage,
});

router.post("/registration", UserController.register);
router.post("/login", UserController.login);
router.post("/locationupdate", UserController.locationUpdate);
router.post("/userupdate", UserController.userupdate);
router.post("/tagUpdate", UserController.tagUpdate);
router.post("/nearbyUsers", UserController.nearbyUsers);
router.post("/sentMessage", UserController.sentMessage);
router.post("/oldMessage", UserController.oldMessage);
router.post("/sentGroupMessage", UserController.sentGroupMessage);
router.post("/oldGroupMessage", UserController.oldGroupMessage);
router.post("/addImage", upload.single("img"),UserController.addImage);

module.exports = router;
