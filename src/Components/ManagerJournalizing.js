import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import './JournalEntry.css';

const ManagerJournalizing = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [comment, setComment] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  
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
            <tr key={entry.id}>
              <td>{entry.journalEntryName}</td>
              <td>{entry.status}</td>
              <td>{entry.createdAt.toLocaleDateString()}</td>
              <td>
                {entry.status === 'pending' ? (
                  <div className="action-buttons">
                    <button
                      className="approve-button"
                      onClick={() => handleUpdateStatus(entry.id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleUpdateStatus(entry.id, 'rejected')}
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
