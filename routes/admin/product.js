const express = require('express');
const multer = require('multer');

const { errorHandler, requireAuth } = require('../../middlewares/middlewares');
const newProductTemplate = require('../../views/admin/products/new');
const productIndexTemplate = require('../../views/admin/products/index');
const { requireTitle, requirePrice } = require('./validator');
const productRepo = require('../../repositories/products');



const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productRepo.getAll();
  res.send(productIndexTemplate({ products }));

});

router.get('/admin/products/new', requireAuth, (req, res) => {
  res.send(newProductTemplate({}));
});

router.post('/admin/products/new', requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  errorHandler(newProductTemplate),
  async (req, res) => {

    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;

    await productRepo.create({ title, price, image });

    res.redirect('/admin/products');
  });


module.exports = router;