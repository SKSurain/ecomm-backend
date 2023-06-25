const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const productRoutes = require("./routes/product")
const cartRoutes = require("./routes/cart")
const orderRoutes = require("./routes/order")
const cors = require("cors")
const stripeRoutes = require("./routes/stripe")

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => { console.log("Connection Success") })
    .catch((e) => { console.log(e) })

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/checkout", stripeRoutes);

app.listen(process.env.PORT_NUMBER || 5000, () => {
    console.log("Backend server is running")
})
