import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

fetch('/config')
  .then((response) => response.json())
  .then((data) => {
    const stripePromise = loadStripe("STRIPE_PUBLISHABLE_KEY");

    ReactDOM.render(
      <React.StrictMode>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </React.StrictMode>,
      document.getElementById('root')
    );
  })
  .catch((error) => {
    console.error('Error:', error);
  });
