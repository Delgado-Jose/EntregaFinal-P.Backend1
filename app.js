const express = require('express');
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const path = require("path");
const app = express();
const port = 8080;
const Product = require("./models/product.js");
const { engine } = require("express-handlebars");

app.engine("handlebars", engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


const server = app.listen(port, () => {
    console.log(`Servidor escuhcando en el puerto ${port}`);
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080",  
        methods: ["GET", "POST"]
    }
});

app.use(express.json());


const productsRouter = require('./routes/products.js')(io);
const cartsRouter = require('./routes/carts.js');
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log("conecctado a MongoDB")).catch(error => console.error("Error al conectarse MongoDB", error));

app.get("/home", async (req, res) => {
    try {
        const products = await Product.find(); 
        console.log("(get de HOME) Datos en Consola: ", products)
        res.render("home", { products });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error al cargar los productos.");
    }
});

app.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await Product.find();
        res.render("realTimeProducts", { products });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error al cargar los productos.");
    }
});



io.on("connection", (socket) => {
    console.log("Cliente conectado");
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

module.exports = { app, io };
