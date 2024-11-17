import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase'; // Your Firebase configuration
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BalanceSheet = () => {
 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [balanceSheetData, setBalanceSheetData] = useState({});
  const [loading, setLoading] = useState(false);


  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');

 
  const fetchBalanceSheetData = async () => {
    setLoading(true);
    try {
      const transactionsCollection = collection(db, 'journalEntries');
      let q;

      if (startDate && endDate) {
        q = query(
          transactionsCollection,
          where('createdAt', '>=', new Date(startDate)),
          where('createdAt', '<=', new Date(endDate))
        );
      } else {
        q = transactionsCollection;
      }

      const transactionsSnapshot = await getDocs(q);
      const transactions = transactionsSnapshot.docs.map(doc => doc.data());

      
      const balanceData = { assets: 0, liabilities: 0, equity: 0 };

      transactions.forEach(transaction => {
        transaction.transactionArray.forEach(item => {
          const [accountName, category, , amount] = item.split(',');
          const amountNumber = parseFloat(amount);
          if (category.toLowerCase() === 'debit') {
            if (accountName.toLowerCase().includes('asset')) {
              balanceData.assets += amountNumber;
            } else if (accountName.toLowerCase().includes('liability')) {
              balanceData.liabilities += amountNumber;
            } else if (accountName.toLowerCase().includes('equity')) {
              balanceData.equity += amountNumber;
            }
          } else if (category.toLowerCase() === 'credit') {
            if (accountName.toLowerCase().includes('asset')) {
              balanceData.assets -= amountNumber;
            } else if (accountName.toLowerCase().includes('liability')) {
              balanceData.liabilities -= amountNumber;
            } else if (accountName.toLowerCase().includes('equity')) {
              balanceData.equity -= amountNumber;
            }
          }
        });
      });

      setBalanceSheetData(balanceData);
    } catch (error) {
      console.error('Error fetching balance sheet data:', error);
    }
    setLoading(false);
  };

  
  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    doc.text('Balance Sheet', 14, 10);

    doc.autoTable({
      head: [['Account', 'Amount']],
      body: [
        ['Assets', balanceSheetData.assets.toFixed(2)],
        ['Liabilities', balanceSheetData.liabilities.toFixed(2)],
        ['Equity', balanceSheetData.equity.toFixed(2)],
      ],
    });

    doc.save('Balance_Sheet.pdf');
  };

  // Fetch emails from 'userRequests' collection
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
    <div className="balance-sheet-container">
      <h1>Balance Sheet</h1>

      {/* Balance Sheet Filters and Data */}
      <div className="filter-section">
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={fetchBalanceSheetData}>Generate</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="balance-sheet-view">
          <h2>Balance Sheet Overview</h2>
          <table className="balance-sheet-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Assets</td>
                <td>{balanceSheetData.assets ? balanceSheetData.assets.toFixed(2) : '0.00'}</td>
              </tr>
              <tr>
                <td>Liabilities</td>
                <td>{balanceSheetData.liabilities ? balanceSheetData.liabilities.toFixed(2) : '0.00'}</td>
              </tr>
              <tr>
                <td>Equity</td>
                <td>{balanceSheetData.equity ? balanceSheetData.equity.toFixed(2) : '0.00'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="actions">
        <button onClick={handleSaveAsPDF}>Save as PDF</button>
      </div>

      {/* Email Selector Form */}
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
    </div>
  );
};

export default BalanceSheet;
