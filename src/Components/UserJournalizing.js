import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from '../firebase';  // Adjust the import path as necessary
import './UserJournalizing.css'; // Make sure to import the CSS file

const UserJournalizing = () => {
  const [entryName, setEntryName] = useState('');
  const [sourceDoc, setSourceDoc] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showJournalEntries, setShowJournalEntries] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const userAccountsCollection = collection(db, "userAccounts");
      const accountsSnapshot = await getDocs(userAccountsCollection);
      const accountsList = accountsSnapshot.docs.map(doc => ({
        uid: doc.id,
        name: doc.data().name,
        catagory: doc.data().catagory // Retain incorrect spelling
      }));
      setAccounts(accountsList);
    };

    fetchAccounts();
  }, []);

  const handleEntryNameChange = (e) => {
    setEntryName(e.target.value);
  };

  const handleSourceDocChange = (e) => {
    setSourceDoc(e.target.files[0]); // Allow file selection but not uploaded
  };

  const handleReset = () => {
    setEntryName('');
    setSourceDoc(null);
    setTransactions([]);
  };

  const handleNewTransaction = () => {
    setTransactions([...transactions, { accountUid: '', accountName: '', catagory: '', description: '', amount: '' }]);
  };

  const handleTransactionChange = (index, field, value) => {
    const updatedTransactions = transactions.map((transaction, i) => 
      i === index ? { ...transaction, [field]: value } : transaction
    );
    setTransactions(updatedTransactions);
  };

  const handleAccountSelect = (index, accountUid) => {
    const selectedAccount = accounts.find(account => account.uid === accountUid);
    const updatedTransactions = transactions.map((transaction, i) =>
      i === index ? { 
        ...transaction, 
        accountUid: accountUid, 
        accountName: selectedAccount.name, // Store the account name
        catagory: selectedAccount.catagory 
      } : transaction
    );
    setTransactions(updatedTransactions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!entryName || !transactions.length) {
      alert('Please fill out all fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create the transactionArray string
      const transactionArray = transactions.map(transaction => 
        `${transaction.accountName},${transaction.catagory},${transaction.description},${transaction.amount}`
      );

      // Add journal entry to Firestore
      await addDoc(collection(db, 'journalEntries'), {
        journalEntryName: entryName,
        sourceDoc: sourceDoc ? sourceDoc.name : '', // Save file name only if present
        status: "pending",
        transactionArray: transactionArray, // Array of comma-separated strings
        createdAt: Timestamp.now()
      });

      alert('Journal entry successfully added!');
      handleReset();
    } catch (error) {
      console.error('Error adding journal entry: ', error);
      alert('Failed to add journal entry. Please try again.');
    }

    setIsSubmitting(false);
  };

  const handleDisplayJournalEntries = async () => {
    const journalEntriesCollection = collection(db, "journalEntries");
    const journalEntriesSnapshot = await getDocs(journalEntriesCollection);
    const entries = journalEntriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setJournalEntries(entries);
    setShowJournalEntries(true);
  };

  const handleBack = () => {
    setShowJournalEntries(false);
  };

  return (
    <div className="user-journalizing-container">
      {/* Display Journal Entries Button */}
      {showJournalEntries ? (
        <div>
          <button onClick={handleBack}>Back</button>
          <h1>Journal Entries</h1>
          <table>
            <thead>
              <tr>
                <th>Journal Entry Name</th>
                <th>Source Document</th>
                <th>Status</th>
                <th>Transactions</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {journalEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.journalEntryName}</td>
                  <td>
                    {entry.sourceDoc && (
                      <a href={`/${entry.sourceDoc}`} download>
                        {entry.sourceDoc}
                      </a>
                    )}
                  </td>
                  <td>{entry.status}</td>
                  <td>
                    {entry.transactionArray.map((transaction, index) => {
                      const [account, catagory, description, amount] = transaction.split(',');
                      return (
                        <div key={index}>
                          Account: {account} | Category: {catagory} | Description: {description} | Amount: {amount}
                        </div>
                      );
                    })}
                  </td>
                  <td>{entry.createdAt.toDate().toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <button onClick={handleDisplayJournalEntries}>Display Journal Entries</button>
          <h1>Journalizing</h1>
          <form onSubmit={handleSubmit}>
            {/* Entry Name */}
            <label htmlFor="entryName">Entry Name:</label>
            <input 
              type="text" 
              id="entryName" 
              name="entryName" 
              value={entryName} 
              onChange={handleEntryNameChange} 
              required
            />
            <br /><br />

            {/* Source Doc */}
            <label htmlFor="sourceDoc">Source Doc (PDF, Word, CSV, JPG, PNG):</label>
            <input 
              type="file" 
              id="sourceDoc" 
              name="sourceDoc" 
              accept=".pdf,.doc,.docx,.csv,.jpg,.jpeg,.png" 
              onChange={handleSourceDocChange} 
            />
            <br /><br />

            {/* New Transaction Button */}
            <button type="button" onClick={handleNewTransaction}>New Transaction</button>
            <br /><br />

            {/* Transactions */}
            {transactions.map((transaction, index) => (
              <div key={index} className="transaction">
                <label htmlFor={`account-${index}`}>Account:</label>
                <select
                  id={`account-${index}`}
                  value={transaction.accountUid}
                  onChange={(e) => handleAccountSelect(index, e.target.value)}
                  required
                >
                  <option value="">Select Account</option>
                  {accounts.map(account => (
                    <option key={account.uid} value={account.uid}>
                      {account.name}
                    </option>
                  ))}
                </select>
                <br /><br />

                {/* Category Textbox (Read-Only) */}
                <label htmlFor={`catagory-${index}`}>Category:</label>
                <input
                  type="text"
                  id={`catagory-${index}`}
                  value={transaction.catagory}
                  readOnly
                />
                <br /><br />

                {/* Description */}
                <label htmlFor={`description-${index}`}>Description:</label>
                <input
                  type="text"
                  id={`description-${index}`}
                  value={transaction.description}
                  onChange={(e) => handleTransactionChange(index, 'description', e.target.value)}
                  required
                />
                <br /><br />

                {/* Amount (Allow any text input) */}
                <label htmlFor={`amount-${index}`}>Amount:</label>
                <input
                  type="text"
                  id={`amount-${index}`}
                  value={transaction.amount}
                  onChange={(e) => handleTransactionChange(index, 'amount', e.target.value)}
                  required
                />
                <br /><br />
              </div>
            ))}

            {/* Buttons */}
            <button type="reset" onClick={handleReset} disabled={isSubmitting}>Reset</button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserJournalizing;



