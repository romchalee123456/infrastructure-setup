const express = require('express');
const cors = require('cors');
const axios = require("axios");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const borrowingRoutes = require('./routes/borrowingRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/borrowing', borrowingRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});


prisma.$connect()
  .then(() => {
    console.log('Connected to Prisma database successfully');
  })
  .catch((err) => {
    console.error('Prisma connection error:', err);
    process.exit(1);  
  });


app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        status: 'error',
        message: err.message,
    });
});

app.get("/proxy", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing URL");

  try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      res.setHeader("Content-Type", "image/jpeg"); 
      res.send(response.data);
  } catch (error) {
      res.status(500).send("Error fetching image");
  }
});

module.exports = app;
