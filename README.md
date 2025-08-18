# Zetex React Project

This project is a React application for the Zetex ICO Standalone. It provides a user interface for participating in the token sale.

## Project Structure

```
zetex-react
├── public
│   └── index.html          # Main HTML file for the React application
├── src
│   ├── index.jsx           # Entry point of the React application
│   ├── App.jsx             # Main App component
│   ├── components
│   │   └── TokenSaleWidget.jsx # Component for the token sale interface
│   ├── hooks
│   │   └── useSettings.js  # Custom hook for fetching settings
│   ├── services
│   │   └── api.js          # API call functions
│   ├── styles
│   │   └── style.css       # CSS styles for the application
│   └── utils
│       └── ethers.js       # Utility functions for ethers.js
├── package.json            # npm configuration file
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd zetex-react
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Features

- Fetches settings from a local API.
- Displays a token sale interface.
- Utilizes ethers.js for Ethereum interactions.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.