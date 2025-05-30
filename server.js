const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ MongoDB error:', err));

  const authRoutes = require('./routes/authRoutes');
  app.use('/', authRoutes);
  
const PORT = process.env.PORT || 3011;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));