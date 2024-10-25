import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import './UserJournalizing.css';

const UserJournalizing = () => {
  const [entryName, setEntryName] = useState('');
  const [sourceDoc, setSourceDoc] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showJournalEntries, setShowJournalEntries] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      const userAccountsCollection = collection(db, "userAccounts");
      const accountsSnapshot = await getDocs(userAccountsCollection);
      const accountsList = accountsSnapshot.docs.map(doc => ({
        uid: doc.id,
        name: doc.data().name,
        catagory: doc.data().catagory
      }));
      setAccounts(accountsList);
    };

    fetchAccounts();
  }, []);

  const handleEntryNameChange = (e) => {
    setEntryName(e.target.value);
  };

  const handleSourceDocChange = (e) => {
    setSourceDoc(e.target.files[0]);
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
        accountName: selectedAccount.name,
        // Remove this line if you want to allow users to input category manually
        catagory: transaction.catagory || selectedAccount.catagory
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
      // Create the transactionArray string and sort by category
      const transactionArray = transactions.map(transaction =>
        `${transaction.accountName},${transaction.catagory},${transaction.description},${transaction.amount}`
      ).sort((a, b) => {
        const categoryA = a.split(',')[1].toLowerCase();
        const categoryB = b.split(',')[1].toLowerCase();

        // Define priority for both singular and plural forms
        const priority = {
          debit: 1, debits: 1,
          asset: 2, assets: 2,
          credit: 3, credits: 3,
          liability: 4, liabilities: 4
        };

        // Sort based on priority; unknown categories default to a lower priority
        return (priority[categoryA] || 5) - (priority[categoryB] || 5);
      });

      // Add journal entry to Firestore
      await addDoc(collection(db, 'journalEntries'), {
        journalEntryName: entryName,
        sourceDoc: sourceDoc ? sourceDoc.name : '',
        status: "pending",
        transactionArray: transactionArray,
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
    })).sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    setJournalEntries(entries);
    setShowJournalEntries(true);
  };

  const handleBack = () => {
    setShowJournalEntries(false);
  };

  const filteredEntries = journalEntries.filter(entry => {
    const matchesStatus = !statusFilter || entry.status === statusFilter;
    const matchesSearch = entry.transactionArray.some(transaction => {
      const [account, , , amount] = transaction.split(',');
      return (
        account.toLowerCase().includes(searchQuery.toLowerCase()) ||
        amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.createdAt.toDate().toLocaleDateString().includes(searchQuery)
      );
    });
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="user-journalizing-container">
      {showJournalEntries ? (
        <div>
          <button onClick={handleBack}>Back</button>
          <h1>Journal Entries</h1>

          {/* Search bar and Status Filter */}
          <input
            type="text"
            placeholder="Search by Account Name, Amount, or Date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div>
            <label>
              <input
                type="radio"
                value=""
                checked={statusFilter === ""}
                onChange={() => setStatusFilter('')}
              />
              All
            </label>
            <label>
              <input
                type="radio"
                value="pending"
                checked={statusFilter === "pending"}
                onChange={() => setStatusFilter('pending')}
              />
              Pending
            </label>
            <label>
              <input
                type="radio"
                value="approved"
                checked={statusFilter === "approved"}
                onChange={() => setStatusFilter('approved')}
              />
              Approved
            </label>
            <label>
              <input
                type="radio"
                value="rejected"
                checked={statusFilter === "rejected"}
                onChange={() => setStatusFilter('rejected')}
              />
              Rejected
            </label>
          </div>

          {/* Journal Entries Table */}
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
              {filteredEntries.map((entry) => (
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
                  {accounts.map((account) => (
                    <option key={account.uid} value={account.uid}>{account.name}</option>
                  ))}
                </select>
                <br /><br />

                <label htmlFor={`catagory-${index}`}>Category:</label>
                <input
                  type="text"
                  id={`catagory-${index}`}
                  value={transaction.catagory}
                  onChange={(e) => handleTransactionChange(index, 'catagory', e.target.value)} // Allow category input
                  required
                />
                <br /><br />

                <label htmlFor={`description-${index}`}>Description:</label>
                <input
                  type="text"
                  id={`description-${index}`}
                  value={transaction.description}
                  onChange={(e) => handleTransactionChange(index, 'description', e.target.value)}
                  required
                />
                <br /><br />

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







