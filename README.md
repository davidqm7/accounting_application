# Accounting Application

A web-based accounting and finance management system built using Firebase and React. The system allows different types of users (administrator, manager, accountant) to manage financial accounts, journal entries, and generate financial reports. It includes a secure authentication system with password management, role-based access, and real-time data storage.

#### Table of Contents

-  [Introduction](#acounting-application)
-  [Table of Contents](#table-of-contents)
-  [Project Overview](#project-overview)
-  [Team Members](#team-members)
-  [Technology Stack](#technology-stack)
-  [Features](#features)
-  [Installation and Setup](#installation-and-setup)

  
## Project Overview

This project is designed as part of the SWE4713 course. It is a web application that allows users to manage accounting and finance-related tasks. The system includes user authentication, chart of accounts management, journalizing transactions, financial report generation, and secure role-based access for different user types

## Team Members

David Quintanilla, Jesse Israel, Husain Falih

## Technology Stack

Frontend: React.js

Backend: Firebase Functions (Serverless), Node.js

Authentication: Firebase Authentication

Database: Firebase Firestore

## Features

**User Authentication:** Login and registration for three user roles (Administrator, Manager, Accountant).

**Administrator Functions:** User creation, role assignment, update user info, and activate/deactivate accounts.

**Chart of Accounts:** Create and manage accounts; mark accounts as inactive instead of deleting them.

**Journal Entry:** Enter transactions with multiple debits and credits, attach supporting documents, and approve/reject transactions.

**Financial Reporting:** Generate trial balances, income statements, balance sheets, and cash flow statements.

**Password Management:** Secure password reset, expiration alerts, and encryption.

**Role-Based Access Control:** Different views and permissions for Administrators, Managers, and Accountants.

## Installation and Setup
Prerequisites

    Node.js 
    
    Firebase CLI
    
    A Firebase project with Firestore, Authentication, and Cloud Functions enabled


