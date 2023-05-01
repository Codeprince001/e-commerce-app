const express = require('express');
const cartsRepo = require('../../repositories/carts');
const productsRepo = require('../../repositories/products');
const cartShowTemplate = require('../../views/client/cart/show');
const notification = require('../../views/client/notification');

const router = express.Router();

router.post('/cart/products', async (req, res) => {
  let cart;
  console.log(req.body.productId);
  if (!req.session.cartId) {
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // We have a cart! Lets get it from the repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }
  console.log(cart);


  const existingItem = cart.items.find(item => item.id === req.body.productId);

  if (existingItem) {
    // increment quantity and save cart
    existingItem.quantity++;
  } else {
    // add new product id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, { items: cart.items });
  res.send();
  res.redirect('/');
});

router.get('/cart', async (req, res) => {
  if (!req.session.cartId) {
    res.redirect('/');
  }
  const cart = await cartsRepo.getOne(req.session.cartId);
  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }
  res.send(cartShowTemplate({ items: cart.items }));
});

router.post('/cart/products/delete', async (req, res) => {
  const cart = await cartsRepo.getOne(req.session.cartId);
  const items = cart.items.filter(item => item.id !== req.body.itemId);
  await cartsRepo.update((req.session.cartId), { items });
  res.redirect('/cart');
});

module.exports = router;