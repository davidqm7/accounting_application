import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; 
import './UpdateInformation.css'; 

const UpdateInformation = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(db, 'users'); // Get a reference to the 'users' collection
            const usersSnapshot = await getDocs(usersCollection); // Fetch the documents
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedUser) {
            const userRef = doc(db, 'users', selectedUser); // Get a reference to the selected user document
            await updateDoc(userRef, {
                firstName: newUsername,
                email: newEmail,
                role: newRole,
            });
            alert('User information updated successfully!');
        }
    };

    return (
        <div className="update-information-container">
            <h1>Update System User</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="selectUser">Select User</label>
                    <select id="selectUser" onChange={(e) => setSelectedUser(e.target.value)} required>
                        <option value="" disabled selected>Select a user</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.firstName} {user.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter new username"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter new email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select id="role" value={newRole} onChange={(e) => setNewRole(e.target.value)} required>
                        <option value="" disabled selected>Select a role</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="User">User</option>
                    </select>
                </div>

                <button type="submit">Update User Information</button>
            </form>

            <div className="info" id="info">
                {selectedUser && (
                    <div>
                        <h2>Updated Information:</h2>
                        <p><strong>New Username:</strong> {newUsername}</p>
                        <p><strong>New Email:</strong> {newEmail}</p>
                        <p><strong>New Role:</strong> {newRole}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateInformation;
