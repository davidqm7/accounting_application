import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import './Activation.css'; // Make sure to import the CSS file

const Activation = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateDoc(doc(db, 'users', user.id), { status: newStatus });
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <div className="activation-container">
      <h1>Admin User Management</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td className="status">{user.status}</td>
              <td>
                <button 
                  className={`toggle-button ${user.status === 'Active' ? 'deactivate' : 'activate'}`}
                  onClick={() => toggleStatus(user)}
                >
                  {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Activation;
