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
  const reportRef = useRef();

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
        {/* Add email functionality when completed */}
      </div>
    </div>
  );
};

export default TrialBalance;
