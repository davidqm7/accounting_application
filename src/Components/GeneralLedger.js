import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import './GeneralLedger.css';

const GeneralLedger = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userAccounts, setUserAccounts] = useState([]);
  const [selectedAccountName, setSelectedAccountName] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startingBalance, setStartingBalance] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  
  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        const accountsSnapshot = await getDocs(collection(db, 'userAccounts'));
        const accountsList = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserAccounts(accountsList);
      } catch (error) {
        console.error("Error fetching user accounts:", error);
      }
    };
    fetchUserAccounts();
  }, []);

  
  const fetchAccountDetails = async (accountId, isUid = false) => {
    try {
      const accountDocRef = isUid 
        ? query(collection(db, 'userAccounts'), where('uid', '==', accountId))
        : doc(db, 'userAccounts', accountId);

      const accountData = isUid
        ? await getDocs(accountDocRef).then(snapshot => snapshot.empty ? null : snapshot.docs[0].data())
        : await getDoc(accountDocRef).then(snapshot => snapshot.exists() ? snapshot.data() : null);

      if (accountData) {
        setSelectedAccountName(accountData.name);
        setStartingBalance(parseFloat(accountData.balance).toFixed(2));
        fetchFilteredTransactions(accountData.name);
      } else {
        console.log("No document found for the provided account ID or UID:", accountId);
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  
  const fetchFilteredTransactions = async (accountName) => {
    try {
      const entriesSnapshot = await getDocs(collection(db, 'journalEntries'));
      const matchingTransactions = [];

      entriesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.status !== 'approved') return; 

        const entryName = data.journalEntryName;
        const journalEntryId = doc.id; 
        data.transactionArray.forEach(transaction => {
          const [account, category, description, amount] = transaction.split(',');
          const transactionDate = data.createdAt.toDate();
          const formattedDate = transactionDate.toLocaleDateString();

          if (account.trim() === accountName) {
            matchingTransactions.push({
              date: formattedDate,
              entryName,
              description,
              amount: parseFloat(amount).toFixed(2),
              isDebit: category.trim().toLowerCase() === 'debit',
              createdAt: transactionDate,
              journalEntryId 
            });
          }
        });
      });

      setFilteredTransactions(matchingTransactions);
    } catch (error) {
      console.error("Error fetching filtered transactions:", error);
    }
  };

  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accountId = queryParams.get('id') || queryParams.get('uid');
    const isUid = queryParams.has('uid');

    if (accountId) {
      setSelectedAccountId(accountId);
      fetchAccountDetails(accountId, isUid); 
    }
  }, [location]);

  
  const handleAccountSelect = async (e) => {
    const accountId = e.target.value;
    setSelectedAccountId(accountId);
    fetchAccountDetails(accountId); 
  };

  
  const handleStartDateChange = (e) => setStartDate(new Date(e.target.value));
  const handleEndDateChange = (e) => setEndDate(new Date(e.target.value));

 
  const calculateBalance = (transactions) => {
    let currentBalance = parseFloat(startingBalance);
    return transactions
      .filter(transaction => {
        const transactionDate = transaction.createdAt;
        return (
          (!startDate || transactionDate >= startDate) &&
          (!endDate || transactionDate <= endDate)
        );
      })
      .map(transaction => {
        currentBalance += transaction.isDebit ? parseFloat(transaction.amount) : -parseFloat(transaction.amount);
        return { ...transaction, balance: currentBalance.toFixed(2) };
      });
  };

  // Navigate to the Journal Entry page for a specific PR link
  const handlePRClick = (journalEntryId) => {
    navigate(`/journal-entry?id=${journalEntryId}`);
  };

  return (
    <div className="general-ledger-container">
      <h1>General Ledger</h1>

      {/* Dropdown for account selection */}
      {!selectedAccountId && (
        <select onChange={handleAccountSelect} defaultValue="">
          <option value="" disabled>Select an Account</option>
          {userAccounts.map(account => (
            <option key={account.id} value={account.id}>{account.name}</option>
          ))}
        </select>
      )}
      
      {selectedAccountName && (
        <>
          <h2>Account: {selectedAccountName}</h2>
          <h3>Starting Balance: ${startingBalance}</h3>

          <div className="date-filters">
            <label>
              Start Date:
              <input
                type="date"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={handleStartDateChange}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={handleEndDateChange}
              />
            </label>
          </div>

          <table className="general-ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Entry Name</th>
                <th>Description</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
                <th>Post Ref (PR)</th>
              </tr>
            </thead>
            <tbody>
              {calculateBalance(filteredTransactions).map((transaction, index) => (
                <tr key={index} className={transaction.isDebit ? "debit-row" : "credit-row"}>
                  <td>{transaction.date}</td>
                  <td>{transaction.entryName}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.isDebit ? transaction.amount : ''}</td>
                  <td>{!transaction.isDebit ? transaction.amount : ''}</td>
                  <td>{transaction.balance}</td>
                  <td>
                    <button onClick={() => handlePRClick(transaction.journalEntryId)}>
                      View PR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default GeneralLedger;
