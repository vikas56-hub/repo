import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';
import { Redirect } from 'react-router-dom';


function Courses() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    stripe.prices.list({ active: true }).then((data) => {
      setPrices(data.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cardElement = elements.getElement(CardElement);

    let { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: name,
        }
      }
    });

    if (error) {
      setMessages(error.message);
      return;
    }

    paymentIntent(paymentIntent);
  };

  if (paymentIntent && paymentIntent.status === 'succeeded') {
    return <Redirect to={{ pathname: '../../userdasboard.js' }} />;
  }

  return (
    <div>
      {prices.map((price) => (
        <div key={price.id}>
          <h3>{price.nickname}</h3>
          <p>{price.unit_amount}</p>
          <button onSubmit={handleSubmit} >Subscribe</button>
        </div>
      ))}
    </div>
  );
}

export default Courses;
