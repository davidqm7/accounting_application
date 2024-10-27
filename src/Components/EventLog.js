import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore"; 
import { db } from '../firebase'; 
import './EventLog.css'; 

const UserReport = () => {
    const [eventLogs, setEventLogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventLogMessages = async () => {
            try {
                const eventLogMessagesCollection = collection(db, 'eventLogMessages'); 
                const eventLogMessagesSnapshot = await getDocs(eventLogMessagesCollection); 

                // Extract and sort by messageTime in descending order
                const eventLogsList = eventLogMessagesSnapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        messageString: doc.data().messageString,
                        messageTime: doc.data().messageTime?.toDate(), // Convert Firestore Timestamp to Date
                        changedBy: doc.data().changedBy || 'Unknown' // Fetch changedBy or default to 'Unknown'
                    }))
                    .sort((a, b) => b.messageTime - a.messageTime); // Sort in descending order

                setEventLogs(eventLogsList); // Store in state
            } catch (error) {
                console.error("Error fetching event logs:", error); 
            }
        };
        fetchEventLogMessages();
    }, []);

    return (
        <div className="event-log-container">
            <h1>Admin Dashboard - Event Log</h1>
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Time</th>
                        <th>Changed By</th>
                    </tr>
                </thead>
                <tbody>
                    {eventLogs.length > 0 ? (
                        eventLogs.map((log) => (
                            <tr key={log.id}>
                                <td>{log.messageString || 'N/A'}</td>
                                <td>{log.messageTime ? log.messageTime.toLocaleString() : 'N/A'}</td>
                                <td>{log.changedBy}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No event logs found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserReport;


