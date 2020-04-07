const router = require("express").Router();
const wrap = require("../middleware/wrap");
const { getTickers } = require("../service/tickers");

router.get("/", wrap(async (req, res) => {
  const t = await getTickers();
  await res.json(t);
}));

module.exports = router;
