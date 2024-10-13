import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './Details.css';

const Details = () => {
    const { uid } = useParams(); // Get the 'uid' from the URL parameter
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch user from userAccounts collection
                const userAccountsQuery = query(collection(db, 'userAccounts'), where('uid', '==', uid));
                const userAccountsSnapshot = await getDocs(userAccountsQuery);
                
                let userAccountData = null;
                if (userAccountsSnapshot.docs.length > 0) {
                    userAccountData = userAccountsSnapshot.docs[0].data();
                    console.log('User Account Data:', userAccountData);
                }

                // Fetch user from userRequests collection
                const userRequestsQuery = query(collection(db, 'userRequests'), where('uid', '==', uid));
                const userRequestsSnapshot = await getDocs(userRequestsQuery);
                
                let userRequestsData = null;
                if (userRequestsSnapshot.docs.length > 0) {
                    userRequestsData = userRequestsSnapshot.docs[0].data();
                    console.log('User Requests Data:', userRequestsData);
                }

                // Combine both user account and request data
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
                setLoading(false); // Stop loading
            }
        };

        fetchDetails();
    }, [uid]);

    if (loading) {
        return <div>Loading...</div>; // Display while data is loading
    }

    if (error) {
        return <div>{error}</div>; // Display any error messages
    }

    return (
        <div className="details-container">
            <h1>Account Details</h1>
            <div className="details-section">
                <h2>User Account Information</h2>
                <p><strong>Name:</strong> {userDetails.name}</p>
                <p><strong>Category:</strong> {userDetails.catagory}</p>
                <p><strong>Sub Category:</strong> {userDetails.subcatagory}</p>
                <p><strong>Comment:</strong> {userDetails.comment}</p>
                <p><strong>Credit:</strong> {userDetails.credit}</p>
                <p><strong>Debit:</strong> {userDetails.debit}</p>
                <p><strong>Initial Balance:</strong> {userDetails.initialBalance}</p>
                <p><strong>Normal Side:</strong> {userDetails.normalSide}</p>
                <p><strong>Number:</strong> {userDetails.number}</p>
                <p><strong>Order:</strong> {userDetails.order}</p>
                <p><strong>Statement:</strong> {userDetails.statement}</p>
               
            </div>

            <div className="details-section">
                <h2>User Personal Information</h2>
                <p><strong>First Name:</strong> {userDetails.firstName}</p>
                <p><strong>Last Name:</strong> {userDetails.lastName}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Role:</strong> {userDetails.role}</p>
                <p><strong>Address:</strong> {userDetails.address}</p>
                <p><strong>Date of Birth:</strong> {userDetails.dob}</p>
                <p><strong>Username:</strong> {userDetails.username}</p>
                
            </div>
        </div>
    );
};

export default Details;
