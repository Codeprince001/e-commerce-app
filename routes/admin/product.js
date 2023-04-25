const express = require('express');
const productRepo = require('../../repositories/products');
const newProductTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validator');
const { validationResult } = require('express-validator');


const router = express.Router();

router.get('/admin/products', (req, res) => {


});

router.get('/admin/products/new', (req, res) => {
  res.send(newProductTemplate({}));
});

router.post('/admin/products/new',
  [requireTitle, requirePrice],
  async (req, res) => {

    const errors = validationResult(req);
    console.log(errors);
    res.send('Submitted');
  });



router.post('',);

router.post('/admin/products/new', async (req, res) => {

});

module.exports = router;