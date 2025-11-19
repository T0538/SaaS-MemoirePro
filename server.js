require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// Configuration Stripe sécurisée via .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Autoriser les requêtes venant de n'importe où
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (Frontend)
app.use(express.static(path.join(__dirname, 'dist')));

// --- ROUTE DE PAIEMENT STRIPE ---
app.post('/create-checkout-session', async (req, res) => {
  try {
    // L'URL du frontend (pour la redirection après paiement)
    const clientUrl = req.get('origin') || 'http://localhost:5173';

    console.log("Création session Stripe pour :", clientUrl);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd', 
            product_data: {
              name: 'Pack Étudiant Pro - MémoirePro AI',
              description: 'Licence à vie, export Word, IA illimitée.',
              images: ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&q=80'], 
            },
            unit_amount: 300, // 3.00 $
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${clientUrl}/#/success`,
      cancel_url: `${clientUrl}/#/checkout`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Gérer toutes les autres routes en renvoyant l'index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});