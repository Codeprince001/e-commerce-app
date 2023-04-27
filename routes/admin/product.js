const express = require('express');
const multer = require('multer');
const { validationResult } = require('express-validator');

const newProductTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validator');
const productRepo = require('../../repositories/products');



const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', (req, res) => {


});

router.get('/admin/products/new', (req, res) => {
  res.send(newProductTemplate({}));
});

router.post('/admin/products/new',
  upload.single('image'),
  [requireTitle, requirePrice],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send(newProductTemplate({ errors }));
    }
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;

    await productRepo.create({ title, price, image });

    res.send('Submitted');
  });


module.exports = router;