const express = require("express");
const cors = require("cors");

const connectMongo = require("./database");
const Auth = require("./controller/Auth");
const Company = require("./controller/Company");
const Product = require("./controller/Product");

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectMongo();

//Auth
app.post("/login", Auth.login);
app.post("/register", Auth.register);

// Company
app.get("/company", Company.index);
app.post("/company", Company.add);
app.put("/company/:_id", Company.update);
app.delete("/company/:_id", Company.remove);

// Product
app.get("/product", Product.index);
app.post("/product", Product.add);
app.put("/product/:_id", Product.update);
app.delete("/product/:_id", Product.remove);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
