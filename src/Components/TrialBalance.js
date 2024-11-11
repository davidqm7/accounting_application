import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useReactToPrint } from 'react-to-print';
import './TrialBalance.css';

const TrialBalance = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [trialBalanceData, setTrialBalanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const reportRef = useRef();

  // Fetch emails from userRequests collection
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

  // Fetch trial balance data based on date range
  const fetchTrialBalanceData = async () => {
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

      // Calculate trial balance
      const balanceData = {};
      transactions.forEach(transaction => {
        transaction.transactionArray.forEach(item => {
          const [accountName, category, , amount] = item.split(',');
          const amountNumber = parseFloat(amount);
          if (!balanceData[accountName]) {
            balanceData[accountName] = { debit: 0, credit: 0 };
          }
          if (category.toLowerCase() === 'debit') {
            balanceData[accountName].debit += amountNumber;
          } else if (category.toLowerCase() === 'credit') {
            balanceData[accountName].credit += amountNumber;
          }
        });
      });

      setTrialBalanceData(Object.entries(balanceData).map(([account, { debit, credit }]) => ({
        account,
        debit: debit.toFixed(2),
        credit: credit.toFixed(2)
      })));
    } catch (error) {
      console.error("Error fetching trial balance data:", error);
    }
    setLoading(false);
  };

  // Generate PDF of the trial balance
  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Trial Balance", 14, 10);
    doc.autoTable({
      head: [['Account', 'Debit', 'Credit']],
      body: trialBalanceData.map(data => [data.account, data.debit, data.credit])
    });
    doc.save('Trial_Balance.pdf');
  };

  // Print the trial balance
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: 'Trial_Balance',
  });

  useEffect(() => {
    fetchTrialBalanceData();
  }, [startDate, endDate]);

  // Update form action URL based on selected email
  const formActionUrl = `https://formsubmit.co/${selectedEmail}`;

  return (
    <div className="trial-balance-container">
      <h1>Trial Balance</h1>
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
        <button onClick={fetchTrialBalanceData}>Generate</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div ref={reportRef}>
          <table className="trial-balance-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Debit</th>
                <th>Credit</th>
              </tr>
            </thead>
            <tbody>
              {trialBalanceData.map((data, index) => (
                <tr key={index}>
                  <td>{data.account}</td>
                  <td>{data.debit}</td>
                  <td>{data.credit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="actions">
        <button onClick={handleSaveAsPDF}>Save as PDF</button>
        <button onClick={handlePrint}>Print</button>
      </div>

      {/* Email form section */}
      <div className="send-email-container">
        <h2>Send Trial Balance via Email</h2>
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
            <input type="text" name="subject" value="Trial Balance Report" readOnly />
          </label>

          <label>
            Message:
            <textarea name="message" rows="5" required>
              Please find the attached trial balance report.
            </textarea>
          </label>

          <label>
            Trial Balance:
            <input type="file" name="attachment"></input>
          </label>

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default TrialBalance;

