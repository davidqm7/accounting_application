import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useReactToPrint } from 'react-to-print';
import './TrialBalance.css';


const BalanceSheet = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [balanceSheetData, setBalanceSheetData] = useState({ assets: [], liabilities: [] });
  const [loading, setLoading] = useState(false);
  const reportRef = useRef();

  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');

  // Fetch balance sheet data
  const fetchBalanceSheetData = async () => {
    setLoading(true);
    try {
      const transactionsCollection = collection(db, "journalEntries");
      let q;

      if (startDate && endDate) {
        q = query(transactionsCollection,
          where("createdAt", ">=", new Date(startDate)),
          where("createdAt", "<=", new Date(endDate))
        );
      } else {
        q = transactionsCollection;
      }

      const transactionsSnapshot = await getDocs(q);
      const transactions = transactionsSnapshot.docs.map(doc => doc.data());

      // Group transactions into Assets (debit) and Liabilities (credit)
      const assets = [];
      const liabilities = [];

      transactions.forEach(transaction => {
        transaction.transactionArray.forEach(item => {
          const [accountName, type, , amount] = item.split(',');
          const amountNumber = parseFloat(amount);

          if (type.toLowerCase() === 'debit') {
            assets.push({ account: accountName, amount: amountNumber });
          } else if (type.toLowerCase() === 'credit') {
            liabilities.push({ account: accountName, amount: amountNumber });
          }
        });
      });

      setBalanceSheetData({
        assets,
        liabilities
      });
    } catch (error) {
      console.error("Error fetching balance sheet data:", error);
    }
    setLoading(false);
  };

  // Calculate total for a given array of transactions
  const calculateTotal = (transactions) => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed(2);
  };

  // Generate PDF of the balance sheet
  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Balance Sheet", 14, 10);
    doc.autoTable({
      head: [['Account', 'Amount']],
      body: [
        ...balanceSheetData.assets.map(data => [data.account, data.amount.toFixed(2)]),
        [{ content: 'Total Assets', colSpan: 1 }, calculateTotal(balanceSheetData.assets)],
        ...balanceSheetData.liabilities.map(data => [data.account, data.amount.toFixed(2)]),
        [{ content: 'Total Liabilities', colSpan: 1 }, calculateTotal(balanceSheetData.liabilities)],
      ]
    });
    doc.save('Balance_Sheet.pdf');
  };

  // Print the balance sheet
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: 'Balance_Sheet',
  });

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

  useEffect(() => {
    fetchBalanceSheetData();
  }, [startDate, endDate]);

    // Update form action URL based on selected email
    const formActionUrl = `https://formsubmit.co/${selectedEmail}`;

  return (
    <div className="balance-sheet-container">
      <h1>Balance Sheet</h1>
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
        <div ref={reportRef}>
          <h2>Assets</h2>
          <table className="balance-sheet-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {balanceSheetData.assets.map((data, index) => (
                <tr key={index}>
                  <td>{data.account}</td>
                  <td>{data.amount.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total Assets</strong></td>
                <td><strong>{calculateTotal(balanceSheetData.assets)}</strong></td>
              </tr>
            </tbody>
          </table>

          <h2>Liabilities</h2>
          <table className="balance-sheet-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {balanceSheetData.liabilities.map((data, index) => (
                <tr key={index}>
                  <td>{data.account}</td>
                  <td>{data.amount.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total Liabilities</strong></td>
                <td><strong>{calculateTotal(balanceSheetData.liabilities)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="actions">
        <button onClick={handleSaveAsPDF}>Save as PDF</button>
        <button onClick={handlePrint}>Print</button>
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
