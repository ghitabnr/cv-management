const express = require('express');
const cors = require('cors');
const path = require('path');
const cvRoutes = require('./src/controllers/api');
const htmlRoutes = require('./src/routes/htmlRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use('/api', cvRoutes);

app.use('/', htmlRoutes);

app.use((req, res) => {
  res.status(404).render('404.html');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

module.exports = app; 

