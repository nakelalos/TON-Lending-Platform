// src/dashboard.ts

import express, { Request, Response } from 'express';

const router = express.Router();

// Route handler for the user dashboard
router.get('/dashboard', (req: Request, res: Response) => {
  // Check if the user is authenticated
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login'); // Redirect to login if not authenticated
  }

  // Get the authenticated user's information (you may need to update this based on how user information is stored)
  const user = req.oidc.user;
  
  // Render the dashboard view with the user's information
  res.render('dashboard', { user });
});
// Route handler for the user profile
router.get('/profile', (req: Request, res: Response) => {
    // Check if the user is authenticated
    if (!req.oidc.isAuthenticated()) {
      return res.redirect('/login'); // Redirect to login if not authenticated
    }
  
    // Get the authenticated user's information (you may need to update this based on how user information is stored)
    const user = req.oidc.user;
  
    // Render the profile view with the user's information
    res.render('profile', { user });
  });

  router.get('/loanApplication', (req: Request, res: Response) => {
    // Check if the user is authenticated
    if (!req.oidc.isAuthenticated()) {
      return res.redirect('/login'); // Redirect to login if not authenticated
    }
  
    // Render the loan application view
    res.render('loanApplication');
  });
  
  // Route handler for submitting loan application form
  router.post('/applyLoan', (req: Request, res: Response) => {
    // Check if the user is authenticated
    if (!req.oidc.isAuthenticated()) {
      return res.redirect('/login'); // Redirect to login if not authenticated
    }
  
    // Get the loan application data from the form submission
    const { amount, duration } = req.body;
 
    console.log('Loan Application Data:', { amount, duration });
  
    // Redirect the user to the dashboard after submitting the loan application
    res.redirect('/dashboard');
  });
  

export default router;

