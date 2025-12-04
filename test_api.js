
const http = require('http');

const data = JSON.stringify({
  action: 'generateTopicIdeas',
  payload: {
    prompt: 'Sujet: Intelligence Artificielle. Intérêts: Santé.'
  }
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/gemini',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Response:', body);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
