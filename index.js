require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongooose = require('mongoose');
const router = require('./router/index.js');
const errorMidleware = require('./middleware/error-middleware');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL
  })
);
app.use('/api', router);
app.use(errorMidleware);

const start = async () => {
  try {
    await mongooose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    app.listen(PORT, () => console.log(`Server start on PORT ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
