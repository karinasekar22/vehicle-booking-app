# Vehicle-booking-app

## 🔧 Tech Stack

- **Backend**: Node.js, Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL(v11.22)
- **Authentication**: JWT
- **Export**: ExcelJS
- **Logging**: Custom logging via Sequelize model
- **Environment**: dotenv, nodemon

## 🚀 Features

- Vehicle booking with 2-level approval
- Admin assigns vehicle, driver, and approvers
- Role-based access (Admin, Approver)
- Approval actions (accept/reject) per level
- Dashboard with vehicle usage statistics
- Export booking reports to Excel
- Action logging for key operations

## 🧑‍💼 Roles

- **Admin**
  - Create bookings
  - Assign driver & approvers
  - View dashboard & exports
    
- **Approver**
  - See assigned bookings
  - Approve/reject based on level

## 🧪 Sample Accounts

| Role      | Email                | Password    |
|-----------|----------------------|-------------|
| Admin     | admin1@example.com   | password123 |
| Approver1 | approver1@example.com| password123 |
| Approver2 | approver2@example.com| password123 |

## 💾 Database

- **PostgreSQL**
- Version: `11.22`


- **## How to Run**
1. Clone Repo
```bash
git clone https://github.com/karinasekar22/vehicle-booking-app.git

cd VehicleApp
```
2. Install Backend Dependencies
```bash
npm install
```
3. Create .env file
```bash
DB_NAME=your_db
DB_USER=you
DB_PASSWORD=your_password
DB_HOST=localhost
JWT_SECRET=your_secret

```
4. (Optional) To populate with sample data:
```bash
npm install bcrypt 
node seed.js
```
5. Run Backend
```bash
 npm run dev
```
6. Setup Frontend
```bash
cd Frontend

npm install

npm start
```


