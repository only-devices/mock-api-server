// mock-api-server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON body parsing
app.use(express.json());

// Mock database
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Mock secret token - uses environment variable if available
const VALID_TOKEN = process.env.VALID_TOKEN || '570703610f07623232d64e78a6c59f40';

// Middleware to check for valid bearer token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  if (token !== VALID_TOKEN) {
    return res.status(403).json({ error: 'Invalid token' });
  }
  
  next();
};

// Public route
app.get('/', (req, res) => {
  res.send('Mock API Server is running. Use /api routes with proper authentication.');
});

// Protected routes with Bearer token auth
app.get('/api/users', authenticateToken, (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// POST endpoint for /create that just returns 200 OK when receiving a request
app.post('/api/create', authenticateToken, (req, res) => {
  console.log('Received data:', req.body);
  res.status(200).json({ 
    idReadable: '12345',
    $type: 'issue'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});