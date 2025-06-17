const { ObjectId } = require("mongodb");

const { getDb } = require("../util/database");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    return getDb()
      .collection("users")
      .insertOne(this)
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch(console.error);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) =>
      cp.productId.equals(product._id)
    );
    console.log(cartProductIndex);
    console.log(product._id);
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: product._id, quantity: newQuantity });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    return getDb()
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
      .catch(console.error);
  }
  getCart() {
    const productIds = this.cart.items.map((i) => i.productId);
    return getDb()
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              i.productId.equals(p._id);
            }).quantity,
          };
        });
      });
  }

  static findById(userId) {
    return getDb()
      .collection("users")
      .findOne({ _id: ObjectId.createFromHexString(userId) })
      .then((user) => {
        return user;
      })
      .catch(console.error);
  }
}

module.exports = User;
