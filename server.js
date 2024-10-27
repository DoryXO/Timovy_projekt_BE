const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;
const SECRET_KEY = 'your_jwt_secret'; // In real life, store this in environment variables.

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Mock user data with roles
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('adminpass', 10), // Pre-hashed password for testing
    role: 'admin'
  },
  {
    id: 2,
    email: 'user@example.com',
    passwordHash: bcrypt.hashSync('userpass', 10), // Pre-hashed password for testing
    role: 'user'
  }
];

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const userForToken = {
    email: user.email,
    id: user.id,
    role: user.role // Include the role in the token payload
  };

  // Generate JWT
  const token = jwt.sign(userForToken, SECRET_KEY, { expiresIn: '1h' });

  res.status(200).json({ token, email: user.email, role: user.role }); // Include role in response
});

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});