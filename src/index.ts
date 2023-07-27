import WebApp from "@twa-dev/sdk";
import { Bridge } from '@twa-dev/bridge';
import express, { Request, Response } from 'express';
import session from 'express-session';
import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';
import path from 'path';
import dashboardRouter from './dashboard';

const bridge = Bridge.init();
const app = express();
app.use(session({
  secret: process.env.AUTH0_CLIENT_SECRET || 'secret', 
  saveUninitialized: true,
}));

interface User {
  username: string;
  password: string;
}

let authenticatedUser: User | null = null;

console.log(WebApp.isVersionAtLeast("6.2"));

// Function to handle user registration form submission
const registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const usernameInput = document.getElementById('username') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;

  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    // Make a POST request to the server to handle user registration
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('User registration successful.');
    } else {
      alert('User registration failed. Please try again.');
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    alert('An error occurred during user registration. Please try again later.');
  }
});

// Function to handle user login form submission
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const loginUsernameInput = document.getElementById('loginUsername') as HTMLInputElement;
  const loginPasswordInput = document.getElementById('loginPassword') as HTMLInputElement;

  const username = loginUsernameInput.value;
  const password = loginPasswordInput.value;

  try {
    // Make a POST request to the server to handle user login
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      authenticatedUser = { username, password };
      alert('User login successful.');
    } else {
      alert('User login failed. Please try again.');
    }
  } catch (error) {
    console.error('Error during user login:', error);
    alert('An error occurred during user login. Please try again later.');
  }
});

// Function to handle user logout
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', async () => {
  try {
    // Make a POST request to the server to handle user logout
    const response = await fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      authenticatedUser = null;
      alert('User logout successful.');
    } else {
      alert('User logout failed. Please try again.');
    }
  } catch (error) {
    console.error('Error during user logout:', error);
    alert('An error occurred during user logout. Please try again later.');
  }
});
// Middleware to check if user is authenticated
const isAuthenticated = (req: any, res: any, next: any) => {
  if (authenticatedUser) {
    // User is authenticated, continue to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to login page
    res.redirect('/login');
  }
};
// Route handler for protected page
app.get('/protected', isAuthenticated, (req: any, res: any) => {
  res.send('This is a protected page. Only authenticated users can access it.');
});
// Route handler for user registration
app.post('/register', (req: any, res: any) => {
  // Get the username and password from the request body
  const { username, password } = req.body;

  authenticatedUser = { username, password };

  // Send a success response
  res.sendStatus(200);
});

// Route handler for user login
app.post('/login', (req: any, res: any) => {
  // Get the username and password from the request body
  const { username, password } = req.body;


  if (authenticatedUser && authenticatedUser.username === username && authenticatedUser.password === password) {
    // User login successful
    res.sendStatus(200);
  } else {
    // User login failed
    res.sendStatus(401);
  }
});

// Route handler for user logout
app.post('/logout', (req: any, res: any) => {
  
  authenticatedUser = null;

  // Send a success response
  res.sendStatus(200);
});
app.use('/', dashboardRouter);

// Define the route for the user profile
app.get('/profile', (req: Request, res: Response) => {
  res.render('profile', { user: req.oidc.user });
});
app.use('/', dashboardRouter);

// Define the route for the loan application form
app.get('/loanApplication', (req: Request, res: Response) => {
  res.render('loanApplication');
});
app.post('/loanApproval/:applicationId', (req: Request, res: Response) => {
  // Get the application ID from the request parameters
  const applicationId = req.params.applicationId;

  // Send a response indicating successful approval
  res.send(`Loan application with ID ${applicationId} has been approved.`);
});

// Defining the route for loan rejection
app.post('/loanRejection/:applicationId', (req: Request, res: Response) => {
  // Get the application ID from the request parameters
  const applicationId = req.params.applicationId;


  // Send a response indicating successful rejection
  res.send(`Loan application with ID ${applicationId} has been rejected.`);
});
// Defining the route for loan approval
app.post('/loanApproval/:applicationId', (req: Request, res: Response) => {
  // Getting the application ID from the request parameters
  const applicationId = req.params.applicationId;

  // Send a response indicating successful approval
  res.send(`Loan application with ID ${applicationId} has been approved.`);
});
const loanApplications: Record<string, LoanApplication> = {
 
  "1": { id: "1", status: "pending", amount: 1000 },
  "2": { id: "2", status: "pending", amount: 2000 },
};

// Define the route for loan approval
app.post('/loanApproval/:applicationId', (req: Request, res: Response) => {
  // Get the application ID from the request parameters
  const applicationId = req.params.applicationId;

  // Check if the loan application with the given ID exists
  if (!loanApplications[applicationId]) {
    return res.status(404).send(`Loan application with ID ${applicationId} not found.`);
  }

  // Updating the application status to "approved"
  loanApplications[applicationId].status = "approved";

  // Send a response indicating successful approval
  res.send(`Loan application with ID ${applicationId} has been approved.`);
});
app.post('/loanRejection/:applicationId', (req: Request, res: Response) => {
  // Get the application ID from the request parameters
  const applicationId = req.params.applicationId;

  // Check if the loan application with the given ID exists
  if (!loanApplications[applicationId]) {
    return res.status(404).send(`Loan application with ID ${applicationId} not found.`);
  }

  // Update the application status to "rejected"
  loanApplications[applicationId].status = "rejected";

  // Send a response indicating successful rejection
  res.send(`Loan application with ID ${applicationId} has been rejected.`);
});
// Defining a route to fetch the list of loan applications
app.get('/loanApplications', (req: Request, res: Response) => {
  // Fetch the list of loan applications from the data store
  const loanApplicationList = Object.values(loanApplications);

  // Send the list of loan applications as JSON response
  res.json(loanApplicationList);
});
// Definnng a route to handle form submission for a new loan application
app.post('/submitLoanApplication', (req: Request, res: Response) => {
  // Extract loan application data from the form submission
  const amount = Number(req.body.amount);

  // Generate a unique ID for the new loan application
  const id = `app-${Date.now()}`;

  // Create the new loan application object
  const newLoanApplication: LoanApplication = {
    id,
    amount,
    status: 'Pending',
  };

  // Save the new loan application to the data store
  loanApplications[id] = newLoanApplication;

  // Send a response indicating successful submission
  res.json({ message: 'Loan application submitted successfully!', application: newLoanApplication });
});

app.get('/loanApplications', (req: Request, res: Response) => {
  const loanApplicationsList: LoanApplication[] = Object.values(loanApplications);
  res.json(loanApplicationsList);
});

app.post('/api/approve/:id', (req: Request, res: Response) => {
  const loanApplicationId = req.params.id;

  res.json({ success: true, message: 'Loan application approved successfully.' });
});


app.post('/api/reject/:id', (req: Request, res: Response) => {
  const loanApplicationId = req.params.id;

  // Respond with a success message
  res.json({ success: true, message: 'Loan application rejected successfully.' });
});
const pendingLoanApplications: LoanApplication[] = [
  { id: '1', applicantName: 'John Doe', amount: 1000 },
  { id: '2', applicantName: 'Jane Smith', amount: 1500 },
];

// Define the API route for fetching pending loan applications
app.get('/api/pending-loans', (req: Request, res: Response) => {
  
  res.json(pendingLoanApplications);
});
