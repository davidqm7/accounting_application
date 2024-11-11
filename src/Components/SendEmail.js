import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase'; // Adjust the import path as necessary
import './SendEmail.css'; // Ensure the CSS file is properly imported

const SendEmail = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'userRequests'));
        const emailList = querySnapshot.docs.map(doc => doc.data().email);
        setEmails(emailList);
        if (emailList.length > 0) setSelectedEmail(emailList[0]); // Set default selection
      } catch (error) {
        console.error("Error fetching emails: ", error);
      }
    };
    
    fetchEmails();
  }, []);

  // Update form action URL based on selected email
  const formActionUrl = `https://formsubmit.co/${selectedEmail}`;

  return (
    <div className="send-email-container">
      <h1>Send Email</h1>
      <form action={formActionUrl} method="POST">
        <label>
          Name:
          <input type="text" name="name" required />
        </label>

        <label>
          Email:
          <select 
            name="email" 
            value={selectedEmail} 
            onChange={(e) => setSelectedEmail(e.target.value)}
            required
          >
            {emails.map((email, index) => (
              <option key={index} value={email}>
                {email}
              </option>
            ))}
          </select>
        </label>

        <label>
          Subject:
          <input type="text" name="subject" required />
        </label>

        <label>
          Message:
          <textarea name="message" rows="5" required />
        </label>

        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default SendEmail;



