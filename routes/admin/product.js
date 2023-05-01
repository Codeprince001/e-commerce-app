const express = require('express');
const multer = require('multer');

const { errorHandler, requireAuth } = require('../../middlewares/middlewares');
const newProductTemplate = require('../../views/admin/products/new');
const adminProductIndexTemplate = require('../../views/admin/products/index');
const editProductTemplate = require('../../views/admin/products/edit');
const { requireTitle, requirePrice } = require('./validator');
const productRepo = require('../../repositories/products');



const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productRepo.getAll();
  res.send(adminProductIndexTemplate({ products }));
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

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
  const product = await productRepo.getOne(req.params.id);
  if (!product) {
    return res.send("Product not found");
  }

  res.send(editProductTemplate({ product }));

});

router.post('/admin/products/:id/edit',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  errorHandler(editProductTemplate, async (req) => {
    const product = await productRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;
    if (req.file) {
      changes.image = req.file.buffer.toString('base64');
    }
    try {
      await productRepo.update(req.params.id, changes);
    } catch (err) {
      return res.send("Could not find item");
    }

    res.redirect('/admin/products');

  });

router.post('/admin/products/:id/delete', async (req, res) => {
  await productRepo.delete(req.params.id);

  res.redirect('/admin/products');
});


module.exports = router;