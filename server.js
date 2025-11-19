const express = require('express');
const path = require('path');
const app = express();

// Utiliser le port défini par l'hébergeur (Render) ou 3000 par défaut
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques du dossier de build (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Gérer toutes les autres routes en renvoyant l'index.html (SPA)
// Cela permet à React Router de gérer le routing côté client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});