import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import './JournalEntry.css';

const ManagerJournalizing = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [comment, setComment] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedEntry, setExpandedEntry] = useState(null); // Track expanded entry

  // Fetch all journal entries from Firestore
  useEffect(() => {
    const fetchJournalEntries = async () => {
      const journalEntriesCollection = collection(db, "journalEntries");
      const entriesSnapshot = await getDocs(journalEntriesCollection);
      const entriesList = entriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      }));
      setJournalEntries(entriesList);
    };

    fetchJournalEntries();
  }, []);

  // Handle status update for a journal entry
  const handleUpdateStatus = async (entryId, newStatus) => {
    if (newStatus === 'rejected' && (!comment[entryId] || comment[entryId].trim() === '')) {
      setErrorMessage('A comment is required when rejecting an entry.');
      return;
    }
    setErrorMessage('');

    try {
      const entryDocRef = doc(db, 'journalEntries', entryId);
      await updateDoc(entryDocRef, {
        status: newStatus,
        comment: newStatus === 'rejected' ? comment[entryId] : ''
      });

      // Update the local state to reflect the change
      setJournalEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === entryId ? { ...entry, status: newStatus, comment: comment[entryId] || '' } : entry
        )
      );

      alert(`Entry successfully ${newStatus}.`);
    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Failed to update the status. Please try again.");
    }
  };

  const handleCommentChange = (entryId, value) => {
    setComment(prevComments => ({
      ...prevComments,
      [entryId]: value
    }));
  };

  const toggleExpandEntry = (entryId) => {
    setExpandedEntry(prevEntry => (prevEntry === entryId ? null : entryId));
  };

  return (
    <div className="manager-journal-approval-container">
      <h1>Journal Entries Approval</h1>

      <table className="journal-entries-table">
        <thead>
          <tr>
            <th>Entry Name</th>
            <th>Status</th>
            <th>Date Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {journalEntries.map(entry => (
            <React.Fragment key={entry.id}>
              <tr onClick={() => toggleExpandEntry(entry.id)}>
                <td>{entry.journalEntryName}</td>
                <td>{entry.status}</td>
                <td>{entry.createdAt.toLocaleDateString()}</td>
                <td>
                  {entry.status === 'pending' ? (
                    <div className="action-buttons">
                      <button
                        className="approve-button"
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(entry.id, 'approved'); }}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-button"
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(entry.id, 'rejected'); }}
                      >
                        Reject
                      </button>
                      <textarea
                        placeholder="Comment (required if rejecting)"
                        value={comment[entry.id] || ''}
                        onChange={(e) => handleCommentChange(entry.id, e.target.value)}
                        className="comment-field"
                      />
                    </div>
                  ) : (
                    <p>{entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}</p>
                  )}
                </td>
              </tr>

              {/* Expanded row for detailed entry information */}
              {expandedEntry === entry.id && (
                <tr className="expanded-row">
                  <td colSpan="4">
                    <h4>Transaction Details:</h4>
                    <table className="transaction-details-table">
                      <thead>
                        <tr>
                          <th>Account</th>
                          <th>Category</th>
                          <th>Description</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.transactionArray.map((transaction, index) => {
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
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}
    </div>
  );
};

export default ManagerJournalizing;
