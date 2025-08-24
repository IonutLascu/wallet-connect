# Zetex React Project

This project is a React application for the Zetex ICO Standalone. It provides a user interface for participating in the token sale.

## Project Structure

```
client
├── public
│   └── index.html          # Main HTML file for the React application
├── src
│   ├── index.jsx           # Entry point of the React application
│   ├── App.jsx             # Main App component with routing
│   ├── config.js           # Configuration file for API URLs and settings
│   ├── images              # Static image assets
│   │   ├── bnb-logo-200h.png
│   │   ├── dols-logo-200h.png
│   │   ├── info.png
│   │   ├── loading-icon.png
│   │   ├── mm-logo.svg
│   │   ├── wc-logo.svg
│   │   └── zetexsmall-500h.png
│   ├── pages              # Page components
│   │   ├── Exchange.jsx   # Public token exchange/sale page
│   │   ├── Login.jsx      # Admin login page
│   │   └── Settings.jsx   # Admin settings management page
│   ├── services
│   │   └── api.js         # API call functions with authentication
│   ├── styles
│   │   └── style.css      # CSS styles for the application
│   └── utils
│       └── ethers.js      # Utility functions for ethers.js
├── package.json           # npm configuration file
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Routes

- `/` - Redirects to `/settings` (if authenticated) or `/login`
- `/login` - Admin login page
- `/settings` - Admin settings management (requires authentication)
- `/exchange` - Public token sale page (no authentication required)

## Features

- **Public Token Sale**: Exchange page accessible without login, displays remaining time and token sale interface
- **Admin Authentication**: JWT-based login system for admin access
- **Settings Management**: Admin interface for configuring ICO parameters
- **Wallet Integration**: MetaMask and WalletConnect support for blockchain interactions
- **Smart Contract Integration**: Ethers.js integration for BSC/Ethereum transactions
- **Referral System**: Generate and copy referral links
- **Responsive Design**: Custom CSS styling for all devices
- **Real-time Countdown**: Live countdown timer for token sale end date

## Configuration

The application uses settings stored in the backend API including:
- Smart contract addresses
- Token sale parameters (rate, end date, token symbol)
- WalletConnect configuration
- Network settings
