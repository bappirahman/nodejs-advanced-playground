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
    const updatedProduct = {
      items: [{ productId: product._id, quantity: 1 }],
    };
    return getDb()
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedProduct } })
      .catch(console.error);
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
