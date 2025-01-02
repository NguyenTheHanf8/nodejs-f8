import express from "express";
import mongoose from "mongoose";
import Product from "./models/products";

const app = express();
const PORT = 8888;
const sendError = (res, status, message, data = null, error) => {
  res.status(status).json({
    message,
    data,
    error,
  });
};

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/my-db")
  .then(() => {
    console.log("Connect database successfully!");
  })
  .catch((error) => {
    console.error(`Connect failed: ${error}`);
  });

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    if (products.length === 0) {
      return res.status(404).json({
        message: "Không có sản phẩm nào",
        list: [],
      });
    } else {
      return res.status(200).json({
        message: "Lấy danh sách sản phẩm thành công",
        products,
      });
    }
  } catch (error) {
    sendError(500, "Server Error", "Không thể lấy danh sách sản phẩm");
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    } else {
      return res.status(200).json({
        message: "Lấy sản phẩm thành công",
        product,
      });
    }
  } catch (error) {
    sendError(res, 500, "Server Error", "Không thể lấy sản phẩm");
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    res.status(200).json({ message: "Xóa thành công sản phẩm" });
  } catch (error) {
    sendError(res, 500, "Server Error", "Không thể xóa sản phẩm");
  }
});

app.post("/products", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      message: "Tạo sản phẩm thành công",
      newProduct,
    });
  } catch (error) {
    sendError(res, 500, "Server Error", "Không thể tạo sản phẩm");
  }
});

app.patch("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      updatedProduct,
    });
  } catch (error) {
    sendError(res, 500, "Server Error", "Không thể cập nhật sản phẩm");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
