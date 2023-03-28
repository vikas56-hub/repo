import React from "react";
import "../components.style.scss";
import { loadStripe } from '@stripe/stripe-js';
import { withRouter } from 'react-router-dom';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Redirect } from 'react-router-dom';

import HCources from './HomepageCources'

import { useState, useEffect } from 'react';




const Subscribe = ({ location }) => {
  const [clientSecret, setClientSecret] = useState(location.state.clientSecret);
  const [subscriptionId, setSubscriptionId] = useState(location.state.subscriptionId);
  const [name, setName] = useState('');
  const [messages, setMessages] = useState('');
  const [paymentIntent, setPaymentIntent] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Fetch the authenticated user's details from the backend
    fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setName(data.name);
      })
      .catch(error => console.error(error));
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

    setPaymentIntent(paymentIntent);
  };

  if (paymentIntent && paymentIntent.status === 'succeeded') {
    return <Redirect to={{ pathname: '../../userdasboard.js' }} />;
  }

  

  //     <form onSubmit={handleSubmit}>
  //       <label>
  //         Full name
  //         <input
  //           type="text"
  //           id="name"
  //           value={name}
  //           onChange={(e) => setName(e.target.value)}
  //         />
  //       </label>

  //       <CardElement />

  //       <button>Subscribe</button>

  //       <div>{messages}</div>
  //     </form>
  



    return (
      <div className="OurCources-Section">
        <div className="OurCources-Main container">
          <div className="OurCources-text-area flex">
            <h1>Our Cources</h1>
          </div>

          
              
          <div className="OurCource-Cards">
            {HCources.map((el, i) => { 
            return (
              <div className="OC-Card">
                <div className="card-header">
                  <img src={el.C_img} alt="" className="OC-img" />
                </div>
                <div className="OC-text">
                  <h4>{el.C_title}</h4>
                  <hr />
                  <div className="OC-price">
                    <h6> ₹ {el.C_Price} </h6>&nbsp;&nbsp;
                    <del>₹ {el.C_Original_Price}</del>&nbsp;&nbsp;
                    <CardElement />
                        <div className="deal">
                        <button onSubmit={handleSubmit} >Subscribe</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>

        </div>
      </div>
    );
        }

export default Subscribe;
