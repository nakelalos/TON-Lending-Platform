# TON Lending Platform

## Description:

TON Lending Platform is a decentralized lending application built on the **Telegram Web App (TWA) framework**. It allows users to lend and borrow cryptocurrencies in a peer-to-peer manner, without the need for intermediaries. The platform is secure, efficient, and provides a seamless user experience for managing lending activities.

## Features:

- **User Authentication:** Users can create accounts, log in, and securely access their lending dashboard. Authentication is implemented using Auth0 for a robust and secure login experience.
- **Dashboard:** The dashboard provides an overview of a user's lending activities, including their lending balance, active loans, and loan history. Users can easily manage and track their lending portfolio.
- **Lending Pool:** The lending pool is a decentralized pool of funds contributed by users who wish to lend their cryptocurrency. Borrowers can access funds from this pool by offering collateral.
- **Collateralized Loans:** Borrowers can request loans by offering collateral in the form of cryptocurrency. The loan terms, including interest rates and duration, are set by the lending platform's smart contract.
- **Loan Repayment:** Borrowers can repay their loans along with the agreed-upon interest. Failure to repay loans within the specified period may result in the forfeiture of collateral.
- **Smart Contract Integration:** The lending platform utilizes smart contracts for executing lending and borrowing transactions, ensuring transparency and security.

## Implementation:

The application is built using the Telegram Web App (TWA) framework, allowing seamless integration with Telegram's messaging platform. We use TypeScript for writing our codebase, which enhances code quality and maintainability. The Auth0 authentication service is employed to provide secure login functionality.

## Example Code:

- Initializing the Bridge for Communication with Telegram Native App:
```ts
import { Bridge } from '@twa-dev/bridge';

const bridge = Bridge.init({
  debug: true,
  targetOrigin: 'https://web.telegram.org',
});

bridge.postEvent('web_app_login');
```
- User Authentication with Auth0:
```js
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH_CLIENT_ID,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
};

app.use(auth(config));

app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
```
## Installation:

1. Clone the repository:
```bash
git clone https://github.com/your-username/TON-Lending-Platform.git
```
2. Install dependencies:
```
npm install
```
```
npm start
```

