import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import './JournalEntry.css';

const JournalEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState(null);

  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const entryId = queryParams.get('id');

    if (entryId) {
      const fetchJournalEntry = async () => {
        try {
          const docRef = doc(db, 'journalEntries', entryId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setJournalEntry(docSnap.data());
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching journal entry:", error);
        }
      };

      fetchJournalEntry();
    }
  }, [location]);

  return (
    <div className="journal-entry-container">
      <h1>Journal Entry Details</h1>
      
      {journalEntry ? (
        <div className="journal-entry-details">
          <div className="entry-info">
            <h2>{journalEntry.journalEntryName}</h2>
            <p><strong>Status:</strong> {journalEntry.status}</p>
            <p><strong>Created At:</strong> {journalEntry.createdAt.toDate().toLocaleString()}</p>
            {journalEntry.sourceDoc && (
              <p>
                <strong>Source Document:</strong>
                <a href={`/${journalEntry.sourceDoc}`} download>{journalEntry.sourceDoc}</a>
              </p>
            )}
          </div>

          <div className="transactions-section">
            <h3>Transactions</h3>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {journalEntry.transactionArray.map((transaction, index) => {
                  const [account, category, description, amount] = transaction.split(',');
                  return (
                    <tr key={index}>
                      <td>{account}</td>
                      <td>{category}</td>
                      <td>{description}</td>
                      <td>${parseFloat(amount).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button className="back-button" onClick={() => navigate('/general-ledger')}>
            Back to General Ledger
          </button>
        </div>
      ) : (
        <p>Loading journal entry...</p>
      )}
    </div>
  );
};

export default JournalEntry;
