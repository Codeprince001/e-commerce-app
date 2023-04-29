const express = require('express');

const router = express.Router();

router.post('/cart/products', async (req, res) => {
  const { productId } = req.body;
  console.log(productId);

  res.send("product added");
});

module.exports = router;