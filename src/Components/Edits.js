import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import './Edit.css';

const Edits = () => {
    const { uid } = useParams(); 
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
              
                const userAccountsQuery = query(collection(db, 'userAccounts'), where('uid', '==', uid));
                const userAccountsSnapshot = await getDocs(userAccountsQuery);

                let userAccountData = null;
                if (userAccountsSnapshot.docs.length > 0) {
                    userAccountData = userAccountsSnapshot.docs[0].data();
                    console.log('User Account Data:', userAccountData);
                }

                
                const userRequestsQuery = query(collection(db, 'userRequests'), where('uid', '==', uid));
                const userRequestsSnapshot = await getDocs(userRequestsQuery);

                let userRequestsData = null;
                if (userRequestsSnapshot.docs.length > 0) {
                    userRequestsData = userRequestsSnapshot.docs[0].data();
                    console.log('User Requests Data:', userRequestsData);
                }

               
                if (userAccountData && userRequestsData) {
                    setUserDetails({
                        ...userAccountData,
                        ...userRequestsData,
                    });
                } else {
                    setError("No data found for this user.");
                }
            } catch (error) {
                console.error("Error fetching details:", error);
                setError("Error fetching user data.");
            } finally {
                setLoading(false); 
            }
        };

        fetchDetails();
    }, [uid]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
           
            const userAccountsRef = doc(db, 'userAccounts', uid);
            await updateDoc(userAccountsRef, {
                catagory: userDetails.catagory,
                subcatagory: userDetails.subcatagory,
                comment: userDetails.comment,
                credit: userDetails.credit,
                debit: userDetails.debit,
                initialBalance: userDetails.initialBalance,
                normalSide: userDetails.normalSide,
                number: userDetails.number,
                order: userDetails.order,
                statement: userDetails.statement,
            });

            
            const userRequestsRef = doc(db, 'userRequests', uid);
            await updateDoc(userRequestsRef, {
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                role: userDetails.role,
                address: userDetails.address,
                dob: userDetails.dob,
                username: userDetails.username,
            });

            alert("User information updated successfully!");
            navigate(`/details/${uid}`);
        } catch (error) {
            console.error("Error updating user:", error);
            setError("Error saving user data.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="edit-container">
            <h1>Edit Account</h1>
            <form onSubmit={handleSave}>
                <div className="edit-section">
                    <h2>User Account Information</h2>
                    <label>
                        Category:
                        <input type="text" name="catagory" value={userDetails.catagory} onChange={handleInputChange} />
                    </label>
                    <label>
                        Sub Category:
                        <input type="text" name="subcatagory" value={userDetails.subcatagory} onChange={handleInputChange} />
                    </label>
                    <label>
                        Comment:
                        <input type="text" name="comment" value={userDetails.comment} onChange={handleInputChange} />
                    </label>
                    <label>
                        Credit:
                        <input type="text" name="credit" value={userDetails.credit} onChange={handleInputChange} />
                    </label>
                    <label>
                        Debit:
                        <input type="text" name="debit" value={userDetails.debit} onChange={handleInputChange} />
                    </label>
                    <label>
                        Initial Balance:
                        <input type="text" name="initialBalance" value={userDetails.initialBalance} onChange={handleInputChange} />
                    </label>
                    <label>
                        Normal Side:
                        <input type="text" name="normalSide" value={userDetails.normalSide} onChange={handleInputChange} />
                    </label>
                    <label>
                        Number:
                        <input type="text" name="number" value={userDetails.number} onChange={handleInputChange} />
                    </label>
                    <label>
                        Order:
                        <input type="text" name="order" value={userDetails.order} onChange={handleInputChange} />
                    </label>
                    <label>
                        Statement:
                        <input type="text" name="statement" value={userDetails.statement} onChange={handleInputChange} />
                    </label>
                </div>

                <div className="edit-section">
                    <h2>User Personal Information</h2>
                    <label>
                        First Name:
                        <input type="text" name="firstName" value={userDetails.firstName} onChange={handleInputChange} />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="lastName" value={userDetails.lastName} onChange={handleInputChange} />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={userDetails.email} onChange={handleInputChange} />
                    </label>
                    <label>
                        Role:
                        <input type="text" name="role" value={userDetails.role} onChange={handleInputChange} />
                    </label>
                    <label>
                        Address:
                        <input type="text" name="address" value={userDetails.address} onChange={handleInputChange} />
                    </label>
                    <label>
                        Date of Birth:
                        <input type="date" name="dob" value={userDetails.dob} onChange={handleInputChange} />
                    </label>
                    <label>
                        Username:
                        <input type="text" name="username" value={userDetails.username} onChange={handleInputChange} />
                    </label>
                </div>

                <button type="submit" disabled={saving}>Save Changes</button>
            </form>
        </div>
    );
};

export default Edits;
