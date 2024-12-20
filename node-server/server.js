require('dotenv').config();  // Add this at the top to load environment variables
//cd node-server
//node server.js
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const app = express();
const PORT = 5000;
sgMail.setApiKey(process.env.SENDGRID_API_KEY); 
app.use(cors());
app.use(express.json());
app.post('/send-activation-email', (req, res) => {
  const { email, firstName, username } = req.body;
  const msg = {
    to: email,
    from: 'davidqm7@outlook.com',  
    subject: 'Your Account has been Activated',
    text: `Hello ${firstName},\n\nYour account has been activated. Your username is: ${username}.\n\nThank you!`
  };
  sgMail.send(msg)
    .then(() => {
      console.log('Email sent successfully');
      res.status(200).send('Email sent successfully');
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});