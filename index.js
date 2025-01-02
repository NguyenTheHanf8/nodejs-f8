import { createServer } from "node:http";

const hostname = "127.0.0.1";
const PORT = 8888;
const uri = "http://localhost:3000";

const fetchProducts = async () => {
  const response = await fetch(`${uri}/products`);
  const data = await response.json();
  return data;
};

const server = createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/products" && method === "GET") {
    const products = await fetchProducts();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: "Lấy danh sách sản phẩm thành công",
        products,
      })
    );
  } else if (url === "/products" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const { title, price } = JSON.parse(body);
      const newProduct = {
        title,
        price,
      };

      const response = await fetch(`${uri}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      const createdProduct = await response.json();
      res.writeHead(201);
      res.end(JSON.stringify(createdProduct));
    });
  } else if (url.match(/\/products\/\d+/) && method === "PUT") {
    const id = parseInt(url.split("/")[2]);

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const { title, price } = JSON.parse(body);
      const updatedProduct = {
        title,
        price,
      };

      const response = await fetch(`${uri}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        const product = await response.json();
        res.writeHead(200);
        res.end(JSON.stringify(product));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Không thấy sản phẩm" }));
      }
    });
  } else if (url.match(/\/products\/\d+/) && method === "DELETE") {
    const id = parseInt(url.split("/")[2]);

    const response = await fetch(`${uri}/products/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      res.writeHead(200);
      res.end(
        JSON.stringify({
          message: "Xóa sản phẩm thành công",
        })
      );
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "Không thấy sản phẩm" }));
    }
  } else if (url.startsWith("/products/") && method === "GET") {
    const id = parseInt(url.split("/")[2]);

    const response = await fetch(`${uri}/products/${id}`);
    if (response.ok) {
      const product = await response.json();
      res.end(
        JSON.stringify({
          message: "Lấy thông tin sản phẩm thành công",
          product,
        })
      );
    } else {
      res.end(
        JSON.stringify({
          message: "Không thấy sản phẩm",
        })
      );
    }
  } else {
    res.end("Router not found");
  }
});

server.listen(PORT, hostname, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});
