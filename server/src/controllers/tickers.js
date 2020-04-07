const router = require("express").Router();
const wrap = require("../middleware/wrap");
const { getTickersFromExchanges } = require("../adapters");

router.get("/", wrap(async (req, res) => {
  const t = await getTickersFromExchanges();
  await res.json(t);
}));

module.exports = router;
