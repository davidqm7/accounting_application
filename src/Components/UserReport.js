import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"; 
import { db } from '../firebase'; 
import './UserReport.css'; 

const UserReport = () => {
    // State to store the list of users and the search query for filtering
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); 
    const navigate = useNavigate();

    // Fetch users and merge data from userRequests and userAccounts collections
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                 // Get references to the collections in Firestore
                const userRequestsCollection = collection(db, 'userRequests'); 
                const userAccountsCollection = collection(db, 'userAccounts'); 

                // Fetch the documents from both collections
                const userRequestsSnapshot = await getDocs(userRequestsCollection); 
                const userAccountsSnapshot = await getDocs(userAccountsCollection);

                const usersList = userRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const accountsList = userAccountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

               // Merge the user data with their account details
                const mergedUsers = usersList.map(user => ({
                    ...user,
                    accountDetails: accountsList.find(account => account.uid === user.uid)
                }));

                // Update state with the merged user data
                setUsers(mergedUsers);
            } catch (error) {
                console.error("Error fetching users:", error); 
            }
        };
        fetchUsers();
    }, []);

    // Function to toggle the user's status (active/inactive)
    const toggleUserStatus = async (id, currentStatus) => {
        try {
            const userRef = doc(db, 'userRequests', id);
            await updateDoc(userRef, {
                status: !currentStatus
            });
            setUsers(users.map(user => user.id === id ? { ...user, status: !currentStatus } : user));
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    };

 
     // Function to navigate to the edit page for a specific user
    const goToEdit = (uid) => {
        navigate(`/edits/${uid}`);
    };
    
     // Filter users based on the search query (account number or account name)
    const filteredUsers = users.filter(user => {
        const accountNumber = user?.accountDetails?.accountNumber || ''; 
        const accountName = `${user.firstName} ${user.lastName}`.toLowerCase();

        return accountNumber.includes(searchQuery) || accountName.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="user-report-container">
            <h1>Admin Chart of Accounts</h1>

            <div className="section">
                <h2>User Summary</h2>
                <div className="summary-card">
                    <div>
                        <h3>Total Users</h3>
                        <p><strong>{users.length}</strong> users</p>
                    </div>
                    <i className="fas fa-users"></i>
                </div>
                <div className="summary-card">
                    <div>
                        <h3>Active Users</h3>
                        <p><strong>{users.filter(user => user.status).length}</strong> active users</p>
                    </div>
                    <i className="fas fa-user-check"></i>
                </div>
            </div>

            <div className="section">
                <h2>Search Users</h2>
                <input 
                    type="text" 
                    placeholder="Search by account number or account name" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="search-bar"
                />
            </div>

            <div className="section">
                <h2>All Users</h2>
                <div className="user-list">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <div className="user-card" key={user.id}>
                                <div className="user-details">
                                    <strong>Username:</strong> {user.firstName} {user.lastName}<br />
                                    <strong>Email:</strong> {user.email}<br />
                                    <strong>Account Number:</strong> {user?.accountDetails?.accountNumber || 'N/A'}<br />
                                    <strong>Status:</strong> {user.status ? 'Active' : 'Inactive'}
                                </div>
                                <div className="user-actions">
                                <button 
                                    title="View detailed information about this user" 
                                     onClick={() => navigate(`/details/${user.uid}`)} className="details-btn">Details</button>
                                    <button 
                                    title="Edit user information" 
                                    onClick={() => goToEdit(user.uid)} className="edit-btn">Edit</button>
                                    <i className={user.status ? "fas fa-user-lock" : "fas fa-user-check"} 
                                    title={user.status ? "Deactivate User" : "Activate User"} 
                                    onClick={() => toggleUserStatus(user.id, user.status)}></i>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No users found matching your search criteria.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserReport;