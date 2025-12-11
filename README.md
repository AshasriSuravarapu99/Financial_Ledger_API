# Financial Ledger API

A production-ready financial ledger microservice implementing **double-entry bookkeeping**, **ACID-safe transactions**, **strict balance validation**, and **transaction isolation**.

This README describes:

* How double-entry bookkeeping is implemented
* How ACID properties are guaranteed
* Why a specific transaction isolation level was chosen
* How balances are calculated & negative balances are prevented
* Architecture diagram (ASCII format)
* Database ERD diagram (ASCII format)

---

## 📘 Double-Entry Bookkeeping Implementation

Every financial action (deposit, withdrawal, transfer) produces **two ledger entries**:

### Example: Transfer from A → B for ₹100

| Entry | Account | Type   | Amount |
| ----- | ------- | ------ | ------ |
| 1     | A       | Debit  | −100   |
| 2     | B       | Credit | +100   |

This ensures:

* Total credits = total debits
* Ledger always stays balanced
* Transactions remain auditable & immutable

Each API operation creates:

1. A **transaction record** (`transactions` table)
2. Two **ledger entries** (`ledger_entries` table)

---

## 🔐 Ensuring ACID Properties

All financial operations run inside a **single database transaction** using MySQL + Knex.

### 1. **Atomicity**

Either *all* updates succeed (transaction + ledger entries + balance updates) or *none* are applied.

### 2. **Consistency**

* Double-entry model ensures that the ledger never becomes unbalanced.
* Balance validations enforce non-negative balances.

### 3. **Isolation**

* MySQL transaction isolation level used: **REPEATABLE READ**.
* Prevents phantom reads and non-repeatable reads during concurrent transactions.

### 4. **Durability**

MySQL's InnoDB engine persists committed transactions to disk safely.

---

## 🏦 Transaction Isolation Level: REPEATABLE READ

### **Why REPEATABLE READ?**

* Prevents simultaneous transfers from miscalculating available balance
* Avoids race conditions when two users withdraw at the same time
* Ensures all reads inside the transaction are stable

MySQL's REPEATABLE READ is strong enough to avoid balance bugs, while still performing better than SERIALIZABLE.

---

## 💰 Balance Calculation & Negative Balance Prevention

Balances are calculated using:

* Account's initial balance
* Sum of related `ledger_entries` (credits − debits)

Before a withdrawal or transfer:

1. Current balance is queried **inside a transaction**
2. Requested amount is validated
3. If `balance < amount`, the service returns:

```json
{ "error": "Insufficient funds" }
```

This ensures:

* No negative balances
* No overdrafts
* No partial updates

---

## 🏗 Architecture Diagram

```
                          ┌────────────────────┐
                          │   Client / Postman │
                          └───────┬────────────┘
                                  │ HTTP REST
                                  ▼
                         ┌─────────────────────┐
                         │     Express API     │
                         ├─────────────────────┤
                         │ Routes / Validators │
                         │ Controllers         │
                         │ Services            │
                         └───────┬─────────────┘
                                 │ Knex Query Builder
                                 ▼
                     ┌────────────────────────────┐
                     │       MySQL Database       │
                     ├────────────────────────────┤
                     │ accounts                   │
                     │ transactions               │
                     │ ledger_entries             │
                     └────────────────────────────┘
                                   │
                           Double-Entry Logic
                                   │
                                   ▼
                            Accurate Ledger
```

---

## 🗄 Database Schema (ERD)

```
┌───────────────────────────┐
│         accounts          │
├───────────────────────────┤
│ id (PK)                  │
│ name                     │
│ balance                  │
│ currency                 │
│ created_at               │
└───────────┬──────────────┘
            │ 1..n
            │
┌───────────▼──────────────┐
│       transactions        │
├───────────────────────────┤
│ id (PK)                  │
│ type (deposit/withdraw/transfer)
│ amount                   │
│ currency                 │
│ description              │
│ created_at               │
└───────────┬──────────────┘
            │ 1..n
            │
┌───────────▼──────────────┐
│      ledger_entries       │
├───────────────────────────┤
│ id (PK)                  │
│ transaction_id (FK)      │
│ account_id (FK)          │
│ entry_type (credit/debit)│
│ amount                   │
│ created_at               │
└───────────────────────────┘
```

---

## 🚀 Summary

This Financial Ledger API is designed with banking-grade integrity:

* True double-entry accounting
* ACID-safe transactional logic
* Strict validation to prevent negative balances
* Isolation level ensuring concurrency safety
* Clear service architecture
* Clean, normalized database schema

For any additions (Swagger docs, deployment guide, or diagrams as images), just ask!
