const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = new mongodb.ObjectId(id);
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp.then(console.log).catch(console.error);
  }
  static fetchAll() {
    return getDb()
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch(console.error);
  }
  static findById(productId) {
    return getDb()
      .collection("products")
      .find({ _id: new mongodb.ObjectId(productId) })
      .next()
      .then((product) => {
        console.log("id", product);
        return product;
      })
      .catch(console.error);
  }
  static deleteById(productId) {
    return getDb()
      .collection("products")
      .deleteOne({ _id: mongodb.ObjectId(productId) })
      .then((result) => {
        console.log("Deleted product");
        return result;
      })
      .catch((err) => console.error(err));
  }
}

// const Product = sequelize.define("product", {
//   id: {
//     type: DataTypes.INTEGER.UNSIGNED,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   title: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   price: {
//     type: DataTypes.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

module.exports = Product;
