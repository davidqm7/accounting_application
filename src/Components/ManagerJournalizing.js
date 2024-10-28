import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import './JournalEntry.css';

const ManagerJournalizing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [journalEntries, setJournalEntries] = useState([]);
  const [eventLogs, setEventLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [comment, setComment] = useState("");

  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const entryId = queryParams.get('id');
    if (entryId) {
      fetchJournalEntry(entryId);
    }
  }, [location]);

  
  const fetchJournalEntry = async (entryId) => {
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

  
  const approveEntry = async (entryId) => {
    try {
      const docRef = doc(db, 'journalEntries', entryId);
      await updateDoc(docRef, { status: "approved", updatedAt: Timestamp.now() });
      alert("Entry approved.");
      navigate(`/ledger/${journalEntry.accountId}`); // Navigate to the account ledger
    } catch (error) {
      console.error("Error approving entry:", error);
    }
  };

  
  const rejectEntry = async (entryId) => {
    if (!comment) {
      alert("Please enter a reason for rejection.");
      return;
    }
    try {
      const docRef = doc(db, 'journalEntries', entryId);
      await updateDoc(docRef, { status: "rejected", comment, updatedAt: Timestamp.now() });
      alert("Entry rejected.");
      setComment(""); // Clear comment after rejection
    } catch (error) {
      console.error("Error rejecting entry:", error);
    }
  };

  
  const fetchFilteredEntries = async () => {
    const entriesQuery = query(
      collection(db, "journalEntries"),
      where("status", "==", filterStatus)
    );
    const entriesSnapshot = await getDocs(entriesQuery);
    const entriesList = entriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setJournalEntries(entriesList);
  };

  
  const searchEntries = async () => {
    const entriesQuery = query(collection(db, "journalEntries"));
    const entriesSnapshot = await getDocs(entriesQuery);
    const entriesList = entriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(entry =>
        entry.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.amount.toString().includes(searchTerm) ||
        entry.date.toDate().toLocaleDateString().includes(searchTerm)
      );
    setJournalEntries(entriesList);
  };

 
  const fetchEventLogs = async () => {
    const logsSnapshot = await getDocs(collection(db, "eventLogs"));
    const logsList = logsSnapshot.docs.map(doc => doc.data());
    setEventLogs(logsList);
  };

  useEffect(() => {
    fetchFilteredEntries();
    fetchEventLogs();
  }, [filterStatus]);

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

          {journalEntry.status === "pending" && (
            <div className="approval-section">
              <button onClick={() => approveEntry(location.search.get("id"))}>Approve</button>
              <input
                type="text"
                placeholder="Enter rejection reason"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={() => rejectEntry(location.search.get("id"))}>Reject</button>
            </div>
          )}

          <button className="back-button" onClick={() => navigate('/general-ledger')}>
            Back to General Ledger
          </button>
        </div>
      ) : (
        <p>Loading journal entry...</p>
      )}

      {/* Section for filtering entries */}
      <div className="filter-section">
        <h2>Journal Entries by Status</h2>
        <label>Status: </label>
        <select onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="entries-list">
          {journalEntries.map(entry => (
            <div key={entry.id} className="entry">
              <p><strong>{entry.accountName}</strong> - ${entry.amount}</p>
              <p>{entry.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section for search functionality */}
      <div className="search-section">
        <h2>Search Journal Entries</h2>
        <input
          type="text"
          placeholder="Search by account name, amount, or date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={searchEntries}>Search</button>
        <div className="search-results">
          {journalEntries.map(entry => (
            <div key={entry.id} className="entry">
              <p><strong>{entry.accountName}</strong> - ${entry.amount}</p>
              <p>{entry.date.toDate().toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section for event logs */}
      <div className="logs-section">
        <h2>Event Logs</h2>
        {eventLogs.map((log, index) => (
          <div key={index} className="log-entry">
            <p><strong>Account:</strong> {log.accountId}</p>
            <p><strong>Change Type:</strong> {log.changeType}</p>
            <p><strong>Before:</strong> {JSON.stringify(log.before)}</p>
            <p><strong>After:</strong> {JSON.stringify(log.after)}</p>
            <p><strong>Changed By:</strong> {log.userId}</p>
            <p><strong>Date:</strong> {log.timestamp.toDate().toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerJournalizing;
