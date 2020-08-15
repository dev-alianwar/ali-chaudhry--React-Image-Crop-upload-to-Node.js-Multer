const express = require("express");
const router = express.Router();
const uploadController = require('./uploadController');


router.get("/", (req, res) => {
  res.send("Server is up and running...").status(200);
});

router.route("/api/v1/mutler/single").get(uploadController.singleUpload);
router.route("/api/v1/mutler/mutliple").get(uploadController.multipleUpload);


module.exports = router;