import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import './GeneralLedger.css';

const GeneralLedger = () => {
  const [userAccounts, setUserAccounts] = useState([]); // For dropdown menu
  const [selectedAccountName, setSelectedAccountName] = useState(null); // Tracks selected account name
  const [filteredTransactions, setFilteredTransactions] = useState([]); // Stores transactions for display
  const [startingBalance, setStartingBalance] = useState(0); // Stores initial balance

  // Fetch account names for dropdown
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

  // Fetch initial balance for the selected account
  const fetchStartingBalance = async (accountName) => {
    try {
      const accountDoc = userAccounts.find(account => account.name === accountName);
      if (accountDoc) {
        const docRef = doc(db, 'userAccounts', accountDoc.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStartingBalance(parseFloat(docSnap.data().balance).toFixed(2));
        }
      }
    } catch (error) {
      console.error("Error fetching starting balance:", error);
    }
  };

  // Fetch and filter journal entries by account name
  const fetchFilteredTransactions = async (accountName) => {
    try {
      const entriesSnapshot = await getDocs(collection(db, 'journalEntries'));
      const matchingTransactions = [];

      entriesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const entryName = data.journalEntryName;
        data.transactionArray.forEach(transaction => {
          const [account, category, description, amount] = transaction.split(',');
          if (account.trim() === accountName) {
            matchingTransactions.push({
              date: data.createdAt.toDate().toLocaleDateString(),
              entryName,
              category,
              description,
              amount: parseFloat(amount).toFixed(2), // Format amount to two decimal places
              isDebit: /asset|debit/i.test(category), // Assets and debits go in Debit column
            });
          }
        });
      });

      setFilteredTransactions(matchingTransactions);
    } catch (error) {
      console.error("Error fetching filtered transactions:", error);
    }
  };

  // Handle account selection from dropdown
  const handleAccountSelect = async (event) => {
    const accountName = event.target.value;
    setSelectedAccountName(accountName);
    await fetchStartingBalance(accountName); // Fetch initial balance
    fetchFilteredTransactions(accountName);
  };

  // Calculate the balance for each transaction row
  const calculateBalance = (transactions) => {
    let currentBalance = parseFloat(startingBalance);
    return transactions.map(transaction => {
      currentBalance += transaction.isDebit ? parseFloat(transaction.amount) : -parseFloat(transaction.amount);
      return { ...transaction, balance: currentBalance.toFixed(2) };
    });
  };

  return (
    <div className="general-ledger-container">
      <h1>General Ledger</h1>
      
      {/* Dropdown to select an account */}
      <select onChange={handleAccountSelect} defaultValue="">
        <option value="" disabled>Select an Account</option>
        {userAccounts.map(account => (
          <option key={account.id} value={account.name}>{account.name}</option>
        ))}
      </select>

      {/* Table for displaying filtered transactions */}
      {selectedAccountName && (
        <>
          <h2>Starting Balance: ${startingBalance}</h2>
          <table className="general-ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Entry Name</th>
                <th>Description</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {calculateBalance(filteredTransactions).map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.date}</td>
                  <td>{transaction.entryName}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.isDebit ? transaction.amount : ''}</td>
                  <td>{!transaction.isDebit ? transaction.amount : ''}</td>
                  <td>{transaction.balance}</td>
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




