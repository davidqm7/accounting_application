
import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useReactToPrint } from 'react-to-print';
import './TrialBalance.css';


const RetainedEarningsStatement = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [earningsData, setEarningsData] = useState(null);


  const generateEarningsStatement = () => {
    if (!startDate) {
      alert('Please select a start date.');
      return;
    }

    const initialEarnings = 50000; 
    const netIncome = 15000; 
    const dividends = 4000; 
    const retainedEarnings = initialEarnings + netIncome - dividends;

    setEarningsData({
      startDate,
      endDate: endDate || 'Present',
      initialEarnings,
      netIncome,
      dividends,
      retainedEarnings,
    });
  };

  // Export the earnings statement to PDF
  const exportToPDF = () => {
    if (!earningsData) {
      alert('Generate an Earnings Statement first.');
      return;
    }

    const doc = new jsPDF();
    doc.text('Earnings Statement', 20, 10);
    doc.autoTable({
      head: [['Description', 'Amount']],
      body: [
        ['Beginning Retained Earnings', `$${earningsData.initialEarnings.toLocaleString()}`],
        ['Net Income', `$${earningsData.netIncome.toLocaleString()}`],
        ['Dividends Paid', `-$${earningsData.dividends.toLocaleString()}`],
        ['Ending Retained Earnings', `$${earningsData.retainedEarnings.toLocaleString()}`],
      ],
    });
    doc.save('RetainedEarningsStatement.pdf');
  };

  return (
    <div className="earnings-statement-container">
      <h1>Earnings Statement</h1>
      
      {}
      <form>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={generateEarningsStatement}
        >
          Generate Statement
        </button>
      </form>

      {}
      {earningsData && (
        <div className="report">
          <h2>Earnings Statement</h2>
          <p>
            <strong>For the Period:</strong> {earningsData.startDate} to {earningsData.endDate}
          </p>
          <ul>
            <li>
              <strong>Beginning Retained Earnings:</strong> ${earningsData.initialEarnings.toLocaleString()}
            </li>
            <li>
              <strong>Net Income:</strong> ${earningsData.netIncome.toLocaleString()}
            </li>
            <li>
              <strong>Dividends Paid:</strong> -${earningsData.dividends.toLocaleString()}
            </li>
            <li>
              <strong>Ending Retained Earnings:</strong> ${earningsData.retainedEarnings.toLocaleString()}
            </li>
          </ul>
          <button onClick={exportToPDF}>Export to PDF</button>
        </div>
      )}
    </div>
  );
};

const EmailSelector = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');

  // Fetch emails from the 'userRequests' collection
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
      <h2>Send Email</h2>
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
          <input type="text" name="subject" placeholder="Subject" required />
        </label>

        <label>
          Message:
          <textarea name="message" rows="5" placeholder="Your message here..." required />
        </label>

        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default RetainedEarningsStatement;
