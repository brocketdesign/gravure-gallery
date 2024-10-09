require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const imageRoutes = require('./routes/imageRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/images', imageRoutes);
app.use('/api/contact', contactRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
