const router = require("express").Router();
const wrap = require("../middleware/wrap");

router.get("/", wrap(async (req, res) => {
  await res.json({
    status: "ok",
  });
}));

module.exports = router;
