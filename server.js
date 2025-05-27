const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
const cors = require('cors');
const path = require("path");

const app = express();
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Losmuchos6',
  database: 'botigafactura'
});

connection.connect((err) =>{
  if (err) throw err;
  console.log('Estas connectat a la BD')
})

app.use(express.json());
app.post('/api/compras', (req, res) => {
  const { nombre, cantidad, moneda } = req.body;

  const sql = 'INSERT INTO compras (nombre_producto, cantidad_comprada, moneda) VALUES (?, ?, ?)';
  connection.query(sql, [nombre, cantidad, moneda], (err, result) => {
    if (err) {
      console.error('Error al insertar en la BD:', err);
      return res.status(500).send('Error al guardar la compra');
    }
    res.status(200).send('Compra guardada correctamente');
  });
});


app.get('/api/exchange-rates', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,binancecoin&vs_currencies=usd,eur'
    );

    const data = response.data;
    console.log('Datos recibidos de CoinGecko:', data);

    const btcUsd = data.bitcoin.usd;
    const btcEur = data.bitcoin.eur;
    const bnbUsd = data.binancecoin.usd;


    const rates = {
      usd: 1,
      eur: btcEur / btcUsd,
      bnb: bnbUsd,
      btc: btcUsd,
    };

    res.json(rates);
  } catch (error) {
    console.error('Error al obtener las tasas:', error.message);
    res.status(500).json({ message: 'Error fetching exchange rates' });
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
