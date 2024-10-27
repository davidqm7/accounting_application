import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import './UserJournalizing.css';

const UserJournalizing = () => {
  const [entryName, setEntryName] = useState('');
  const [sourceDoc, setSourceDoc] = useState(null);
  const [debits, setDebits] = useState([]);
  const [credits, setCredits] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [currentError, setCurrentError] = useState(null);

  
  useEffect(() => {
    const fetchErrorMessages = async () => {
      const errorMessagesCollection = collection(db, 'errorMessages');
      const errorMessagesSnapshot = await getDocs(errorMessagesCollection);
      const messages = {};
      errorMessagesSnapshot.docs.forEach(doc => {
        messages[doc.id] = doc.data().messageText;
      });
      setErrorMessages(messages);
    };

    fetchErrorMessages();
  }, []);

  // Fetch account names
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

  const handleEntryNameChange = (e) => setEntryName(e.target.value);
  const handleSourceDocChange = (e) => setSourceDoc(e.target.files[0]);

  const handleReset = () => {
    setEntryName('');
    setSourceDoc(null);
    setDebits([]);
    setCredits([]);
    setCurrentError(null);
  };

  const handleNewTransaction = () => {
    setDebits([{ accountUid: '', accountName: '', catagory: 'debit', description: '', amount: '' }]);
    setCredits([{ accountUid: '', accountName: '', catagory: 'credit', description: '', amount: '' }]);
  };

  const handleAddDebit = () => setDebits([...debits, { accountUid: '', accountName: '', catagory: 'debit', description: '', amount: '' }]);
  const handleAddCredit = () => setCredits([...credits, { accountUid: '', accountName: '', catagory: 'credit', description: '', amount: '' }]);

  const handleTransactionChange = (index, field, value, type) => {
    const updatedTransactions = (type === 'debit' ? debits : credits).map((transaction, i) =>
      i === index ? { ...transaction, [field]: value } : transaction
    );
    type === 'debit' ? setDebits(updatedTransactions) : setCredits(updatedTransactions);
  };

  const handleAccountSelect = (index, accountUid, type) => {
    const selectedAccount = accounts.find(account => account.uid === accountUid);
    const updatedTransactions = (type === 'debit' ? debits : credits).map((transaction, i) =>
      i === index ? {
        ...transaction,
        accountUid: accountUid,
        accountName: selectedAccount.name,
        catagory: type === 'debit' ? 'debit' : 'credit'
      } : transaction
    );
    type === 'debit' ? setDebits(updatedTransactions) : setCredits(updatedTransactions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCurrentError(null);

    
    if (!entryName) {
      setCurrentError('missingEntryName');
      setIsSubmitting(false);
      return;
    }

    if (debits.length === 0) {
      setCurrentError('missingDebit');
      setIsSubmitting(false);
      return;
    }

    if (credits.length === 0) {
      setCurrentError('missingCredit');
      setIsSubmitting(false);
      return;
    }

    
    for (const transaction of debits) {
      if (!transaction.accountUid) {
        setCurrentError('missingDebitAccount');
        setIsSubmitting(false);
        return;
      }
      if (!transaction.amount || transaction.amount <= 0) {
        setCurrentError('positiveDebitAmount');
        setIsSubmitting(false);
        return;
      }
    }

    for (const transaction of credits) {
      if (!transaction.accountUid) {
        setCurrentError('missingCreditAccount');
        setIsSubmitting(false);
        return;
      }
      if (!transaction.amount || transaction.amount <= 0) {
        setCurrentError('positiveCreditAmount');
        setIsSubmitting(false);
        return;
      }
    }

    
    const totalDebits = debits.reduce((sum, debit) => sum + parseFloat(debit.amount || 0), 0);
    const totalCredits = credits.reduce((sum, credit) => sum + parseFloat(credit.amount || 0), 0);

    if (totalDebits !== totalCredits) {
      setCurrentError('debitCreditMismatch');
      setIsSubmitting(false);
      return;
    }

    
    try {
      const transactionArray = [
        ...debits.map(transaction => `${transaction.accountName},${transaction.catagory},${transaction.description},${transaction.amount}`),
        ...credits.map(transaction => `${transaction.accountName},${transaction.catagory},${transaction.description},${transaction.amount}`)
      ];

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

  return (
    <div className="user-journalizing-container">
     
      <h1>Journalizing</h1>
      <form onSubmit={handleSubmit}>
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

        <label htmlFor="sourceDoc">Source Doc (PDF, Word, CSV, JPG, PNG):</label>
        <input
          type="file"
          id="sourceDoc"
          name="sourceDoc"
          accept=".pdf,.doc,.docx,.csv,.jpg,.jpeg,.png"
          onChange={handleSourceDocChange}
        />
        <br /><br />

        <button type="button" onClick={handleNewTransaction}>New Transaction</button>
        <br /><br />

        {debits.length > 0 && (
          <>
            <h2>Debits</h2>
            {debits.map((debit, index) => (
              <div key={index} className="transaction">
                <label>Account:</label>
                <select onChange={(e) => handleAccountSelect(index, e.target.value, 'debit')} required>
                  <option value="">Select Account</option>
                  {accounts.map(account => <option key={account.uid} value={account.uid}>{account.name}</option>)}
                </select>
                <input type="text" placeholder="Description" value={debit.description} onChange={(e) => handleTransactionChange(index, 'description', e.target.value, 'debit')} required />
                <input type="number" placeholder="Amount" value={debit.amount} onChange={(e) => handleTransactionChange(index, 'amount', e.target.value, 'debit')} required />
              </div>
            ))}
            <button type="button" onClick={handleAddDebit}>Add Debit</button>
          </>
        )}

        {credits.length > 0 && (
          <>
            <h2>Credits</h2>
            {credits.map((credit, index) => (
              <div key={index} className="transaction">
                <label>Account:</label>
                <select onChange={(e) => handleAccountSelect(index, e.target.value, 'credit')} required>
                  <option value="">Select Account</option>
                  {accounts.map(account => <option key={account.uid} value={account.uid}>{account.name}</option>)}
                </select>
                <input type="text" placeholder="Description" value={credit.description} onChange={(e) => handleTransactionChange(index, 'description', e.target.value, 'credit')} required />
                <input type="number" placeholder="Amount" value={credit.amount} onChange={(e) => handleTransactionChange(index, 'amount', e.target.value, 'credit')} required />
              </div>
            ))}
            <button type="button" onClick={handleAddCredit}>Add Credit</button>
          </>
        )}

        <br />
        <button type="reset" onClick={handleReset} disabled={isSubmitting}>Reset</button>
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
      </form>
      {currentError && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          {errorMessages[currentError]}
        </p>
      )}
    </div>
  );
};

export default UserJournalizing;
