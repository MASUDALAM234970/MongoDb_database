const { decrypt } = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3002;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Create Schema
const productsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// create product model

const product = mongoose.model("Product", productsSchema);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/testProductBD");
    console.log("db is connected");
  } catch (error) {
    console.log("db is not connected" + error);
  }
};
app.get("/products", async (req, res) => {
  try {
    const products = await product.find().limit(2);
    if (products) {
      res.status(200).send(products);
    } else {
      res.status(400).send({
        message: "products not found",
      });
    }
  } catch (er) {
    res.status(500).send({ message: er.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const products = await product.findOne({ _id: id }).select({
      title: 1,
      price: 1,
      _id: 0,
    });
    if (products) {
      res.status(200).send(products);
    } else {
      res.status(400).send({
        message: "products not found",
      });
    }
  } catch (er) {
    res.status(500).send({ message: er.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    //

    const newProduct = new product({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
    });
    const productData = await newProduct.save();
    res.status(201).send(productData);
  } catch (er) {
    res.status(500).send({ message: er.message });
  }
});

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  await connectDB();
});
