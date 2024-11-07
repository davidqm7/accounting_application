import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import './JournalEntry.css';
import { getFunctions, httpsCallable } from 'firebase/functions';


const AdminJournalizing = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [journalEntry, setJournalEntry] = useState(null);
    const [eventLogs, setEventLogs] = useState([]);
    useEffect(() => {
        fetchEventLogs();
      }, []);
      const fetchEventLogs = async () => {
        const logsSnapshot = await getDocs(collection(db, "eventLogs"));
        const logsList = logsSnapshot.docs.map(doc => doc.data());
        setEventLogs(logsList);
      };
      const sendEmail = async () => {
        const functions = getFunctions();
        const sendEmailToManager = httpsCallable(functions, 'sendEmailToManager');
    
        try {
          await sendEmailToManager({
            subject: 'Admin Notification',
            text: 'Please review the recent changes in the journal entries.',
            recipientEmail: 'manager-email@example.com' // Replace with actual manager email
          });
          alert("Email sent successfully to manager.");
        } catch (error) {
          console.error("Error sending email:", error);
          alert("Failed to send email.");
        }
      };
      return (
        <div className="admin-journalizing-container">
          <h1>Admin Journalizing</h1>
    
          {/* Event Logs */}
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
    
          {/* Send Email Button */}
          <button onClick={sendEmail}>Send Email to Manager</button>
        </div>
      );
    };
    
 
const fetchEventLogs = async () => {
    const logsSnapshot = await getDocs(collection(db, "eventLogs"));
    const logsList = logsSnapshot.docs.map(doc => doc.data());
    setEventLogs(logsList);
  };


{/* EVENT LOGS */}

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

export default AdminJournalizing