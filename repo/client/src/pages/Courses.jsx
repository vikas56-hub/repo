import React, { useState, useEffect } from "react";
import Stripe from "stripe";

function Courses() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    stripe.prices.list({ active: true }).then((data) => {
      setPrices(data.data);
    });
  }, []); 

  const handleSubscribe = async (priceId) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Retrieve the product associated with the price ID
    const price = await stripe.prices.retrieve(priceId);
    const productId = price.product;

    // Retrieve the product details
    const product = await stripe.products.retrieve(productId);

    // Create a Checkout Session with the price ID
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: "https://localhost:3000/api/userdashboard",
      cancel_url: "https://localhost:3000/cancel",
    });

    // Redirect the user to the Stripe Checkout page
    window.location.href = session.url;
  };

  return (
    <div>
      {prices.map((price) => (
        <div key={price.id}>
          <h3>{price.nickname}</h3>
          <p>{price.unit_amount}</p>
          <p>{price.description}</p>
          <button onClick={() => handleSubscribe(price.id)}>Subscribe</button>
        </div>
      ))}
    </div>
  );
}

export default Courses;
