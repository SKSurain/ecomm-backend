const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const productRoutes = require("./routes/product")

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => { console.log("Connection Success") })
    .catch((e) => { console.log(e) })

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);


app.listen(process.env.PORT_NUMBER || 5000, () => {
    console.log("Backend server is running")
})