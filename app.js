//app.js en vez de index.js | product_comments en vez de products_comments | userVerification en vez de verificationUser

const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const mariadb = require("mariadb");

const port = 3000;

const app = express();
const dataFolderPath = path.join(__dirname);

app.use(express.json());

secretKey = "clave secreta";
// token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzAwNjE4Njg2fQ.T1qQzx_sbqE4VRSONzqQ_3WXKWNyS3eknH3A7qrg8jQ

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "jap23",
  database: "emercado",
  connectionLimit: 5,
});

app.post("/login", express.json(), async (req, res) => {
  const { username, password } = req.body;


  let conn;

  try {
    conn = await pool.getConnection();
    const user = await conn.query(
      `SELECT * FROM users WHERE username = ? AND password = ?`,
      [username, password]
    );

    const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error("Error durante el login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const verification = (req, res, next) => {
  const token = req.header("Authorization");
  if (token === undefined) {
    return res
      .status(401)
      .json({ message: "Error: verifique su información." });
  }

  try {
    const userVerification = jwt.verify(token, "secretKey");
    req.usuario = userVerification;
    next();
  } catch (error) {
    res.status(400).json({ message: "Verificación incorrecta" });
  }
};


app.get("/cats/:id", (req, res) => {
  const catsId = req.params.id;
  const filePath = path.join(dataFolderPath, "cats", `${catsId}.json`);
  res.sendFile(filePath);
});

app.get("/cart/:id", (req, res) => {
  const cartId = req.params.id;
  const filePath = path.join(dataFolderPath, "cart", `${cartId}.json`);
  res.sendFile(filePath);
});

app.post('/product-info', async (req, res) => {
  try {
    const cartItems = req.body.cartProducts;

    const connection = await pool.getConnection();

    for (const cartItem of cartItems) {
      const { name, count, unitCost, currency, image } = cartItem;
      const result = await connection.query("INSERT INTO cart (name, count, unitCost, currency, image) VALUES (?, ?, ?, ?, ?)",
        [name, count, unitCost, currency, image]);

      console.log('Query executed successfully. Inserted ID:', result.insertId);
    }

    connection.release();

    res.status(200).json({ message: 'Carrito guardado correctamente' });
  } catch (error) {
    console.error('Error in /product-info route:', error);
    res.status(500).json({ error: 'Error al guardar el carrito' });
  }
});


app.get("/cats_products/:id", (req, res) => {
  const cats_productsId = req.params.id;
  const filePath = path.join(
    dataFolderPath,
    "cats_products",
    `${cats_productsId}.json`
  );
  res.sendFile(filePath);
});

app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  const filePath = path.join(dataFolderPath, "products", `${productId}.json`);
  res.sendFile(filePath);
});

app.get("/product_comments/:id", (req, res) => {
  const product_commentsId = req.params.id;
  const filePath = path.join(
    dataFolderPath,
    "product_comments",
    `${product_commentsId}.json`
  );
  res.sendFile(filePath);
});

app.get("/sell/:id", (req, res) => {
  const sellId = req.params.id;
  const filePath = path.join(dataFolderPath, "sell", `${sellId}.json`);
  res.sendFile(filePath);
});

app.get("/user_cart/:id", (req, res) => {
  const userId = req.params.id;
  const filePath = path.join(dataFolderPath, "user_cart", `${userId}.json`);
  res.sendFile(filePath);
});



app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
