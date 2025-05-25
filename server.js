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

    const rates = {
      usd: 1,
      eur: response.data.bitcoin.eur / response.data.bitcoin.usd,
      bnb: response.data.binancecoin.usd,
      btc: response.data.bitcoin.usd,
    };

    res.json(rates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching exchange rates' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
