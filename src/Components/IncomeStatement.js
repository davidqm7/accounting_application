import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useReactToPrint } from 'react-to-print';
import './IncomeStatement.css';

const IncomeStatement = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [IncomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState('');
    const reportRef = useRef();

  
  //Income Statement must add all balance for a period of time and subtract it from credits.
  
  //Logic: Find all cash/debit and subtract from credit/loans?
  
  
    // Fetch emails from userRequests
    useEffect(() => {
      const fetchEmails = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'userRequests'));

          const emailList = querySnapshot.docs
            .map(doc => doc.data().email)
            .filter(email => email);
          setEmails(emailList);
          setSelectedEmail(emailList[0] || ""); // Set default selection
        } catch (error) {
          console.error("Error fetching emails: ", error);
        }
      };
      
      fetchEmails();
    }, []);

   
//fetch income data from transaction collection firebase
    const fetchIncomeData = async () => {
      setLoading(true);
      try {
        const transactionsCollection = collection(db, "journalEntries");
        let q;
        
        if (startDate && endDate) {
          q = query(
            transactionsCollection,
            where("createdAt", ">=", new Date(startDate)),
            where("createdAt", "<=", new Date(endDate))
          );
        } else {
          q = query(transactionsCollection);
        }
  
        const transactionsSnapshot = await getDocs(q);
        const transactions = transactionsSnapshot.docs.map(doc => doc.data());
  
        // Calculate Income based on balance - credits
        const balanceData = {};
        transactions.forEach(transaction => {
          transaction.transactionArray.forEach(item => {
            const [accountName, category, , amount] = item.split(',');
            const amountNumber = parseFloat(amount);
            if (!balanceData[accountName]) {
              balanceData[accountName] = { balance: 0, credit: 0 };
            }
            if (category.toLowerCase() === 'balance') {
              balanceData[accountName].balance += amountNumber;
            } else if (category.toLowerCase() === 'credit') {
              balanceData[accountName].credit += amountNumber;
            }
          });
        });
  // Set the income data from previous calculation
        setIncomeData(Object.entries(balanceData).map(([account, { balance, credit, balanceTotal }]) => ({
          account,
          balance: balance.toFixed(4),
          credit: credit.toFixed(4),
          balanceTotal: (balance - credit).toFixed(2)
        })));
      } catch (error) {
        console.error("Error could not calculate balance statement:", error);
      }
      setLoading(false);
    };
  // Ability to save income statement as PDF
    const handleSaveAsPDF = () => {
      const doc = new jsPDF();
      doc.text("Income Statement is", 90, 15);
      doc.autoTable({
        head: [['Account', 'Income', 'Expense', 'Total']],
        body: IncomeData.map(data => [data.account, data.balance, data.credit, data.total])
      });
      doc.save('Income.pdf');
    };
  // Ability to print the income statement
    const handlePrint = useReactToPrint({
      content: () => reportRef.current,
      documentTitle: 'Income_Statement',
    });
  
    useEffect(() => {
      fetchIncomeData();
    }, [startDate, endDate]);
  
    // Update form action URL based on selected email
    const formActionUrl = `https://formsubmit.co/${selectedEmail}`;
  
    return (
      <div className="balance-container">
        <h1>Income Statement</h1>
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
          <button onClick={fetchIncomeData}>Generate</button>
        </div>
  
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div ref={reportRef}>
            <table className="balance-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Income</th>
                  <th>Expense</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {IncomeData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.account}</td>
                    <td>{data.balance}</td>
                    <td>{data.credit}</td>
                    <td>{data.total}</td>
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
          <h2>Send Income Statement via Email</h2>
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
              <input type="text" name="subject" value="Income Statement" readOnly />
            </label>
  
            <label>
              Message:
              <textarea name="message" rows="5" required>
                Please find the attached balance statemet.
              </textarea>
            </label>
  
            <label>
              Income Statement:
              <input type="file" name="attachment"></input>
            </label>
  
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    );
  };
  
  export default IncomeStatement;