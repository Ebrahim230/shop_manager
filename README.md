# Sales Manager Application

## Overview
Sales Manager is a full-stack MERN application to manage products, track sales, monitor revenue & profit, and receive alerts for low stock and near-expiry products.

---

## Features

### General
- User-friendly dashboard displaying daily and monthly revenue and profit.
- Real-time alerts for low stock and products nearing expiry.
- Interactive charts for monthly sales and profits using Chart.js.

### Product Management
- Add, update, delete, and view products.
- Track buying price, selling price, stock, and expiry date.

### Sales Management
- Record new sales with automatic revenue and profit calculation.
- View all sales history.
- Generate invoices for each sale.

### Alerts
- Low stock alerts for products below a threshold.
- Expiry alerts for products nearing expiry within 30 days.
- Real-time push notifications using Socket.IO.

---

## Tech Stack

### Backend
- Node.js, Express.js
- MongoDB with Mongoose
- Socket.IO for real-time alerts
- dotenv for environment variables

### Frontend
- React.js
- Chart.js for visualizations
- Axios for API requests
- TailwindCSS for styling

---

## Setup Instructions

### Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/Ebrahim230/shop_manager.git
