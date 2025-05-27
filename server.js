const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

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
