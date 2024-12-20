import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; 
import './RegularUserReport.css'; 

const RegularUserReport = () => {
    const [users, setUsers] = useState([]); // State to store the list of users
    const navigate = useNavigate(); // Hook to navigate to different routes

    useEffect(() => {
         // Fetch user data from Firestore when the component loads
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'userRequests'); 
                const usersSnapshot = await getDocs(usersCollection); 
                const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log("Fetched users:", usersList); // Debug log
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error); 
            }
        };
        fetchUsers();  // Call the function to fetch users
    }, []);

     // Handle clicking on a user card to navigate to their General Ledger
    const handleCardClick = (user) => {
        console.log("Navigating to General Ledger with user UID:", user.uid); // Debug log
        if (user.uid) {
            // Navigate to the General Ledger page with the user's UID as a query parameter
            navigate(`/general-ledger?uid=${user.uid}`);
        } else {
            console.error("User UID is missing for navigation."); // Log error if UID is missing
        }
    };

    return (
        <div className="regular-user-report-container">
            <h1>Regular User Chart of Accounts</h1>

            <div className="section">
                <h2>User Summary</h2>
                <div className="summary-card">
                    <div>
                        <h3>Total Users</h3>
                        <p><strong>{users.length}</strong> users</p>
                    </div>
                    <i className="fas fa-users"></i>
                </div>
            </div>

            <div className="section">
                <h2>All Users</h2>
                <div className="user-list">
                    {users.map(user => (
                        <div 
                            className="user-card" 
                            key={user.id} 
                            onClick={() => handleCardClick(user)} // Pass user.uid to ledger page
                        >
                            <div className="user-details">
                                <strong>Username:</strong> {user.firstName} {user.lastName}<br />
                                <strong>Email:</strong> {user.email}<br />
                                <strong>Role:</strong> {user.role}<br />
                                <strong>Status:</strong> {user.status ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RegularUserReport;
