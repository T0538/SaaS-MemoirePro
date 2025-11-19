
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Gérer les requêtes OPTIONS (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: 'Method Not Allowed'
    };
  }

  try {
    // Récupérer l'URL d'origine pour la redirection
    const referer = event.headers.referer || event.headers.origin;
    const baseUrl = referer ? referer.split('#')[0] : 'https://memoirepro.netlify.app';
    const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

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
            unit_amount: 300, // 3.00 USD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${cleanUrl}/#/success`,
      cancel_url: `${cleanUrl}/#/checkout`,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
