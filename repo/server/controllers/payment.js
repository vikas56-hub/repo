import Stripe from 'stripe'
import User from '../model/User.model';
const stripe = new Stripe('STRIPE_SECRET_KEY')



// export async function createSubscription(createSubscriptionRequest) {
  
//     // create a stripe customer
//     const customer = await this.stripe.customers.create({
//       name: createSubscriptionRequest.name,
//       email: createSubscriptionRequest.email,
//       payment_method: createSubscriptionRequest.paymentMethod,
//       invoice_settings: {
//         default_payment_method: createSubscriptionRequest.paymentMethod,
//       },
//     });


//     // get the price id from the front-end
//     const priceId = createSubscriptionRequest.priceId;

//     // create a stripe subscription
//     const subscription = await this.stripe.subscriptions.create({
//       customer: customer.id,
//       items: [{ price: priceId }],
//       payment_settings: {
//         payment_method_options: {
//           card: {
//             request_three_d_secure: 'any',
//           },
//         },
//         payment_method_types: ['card'],
//         save_default_payment_method: 'on_subscription',
//       },
//       expand: ['latest_invoice.payment_intent'],
//     });

//     // return the client secret and subscription id
//     return {
//       clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//       subscriptionId: subscription.id,
//     };
//   }

  export const createcustomer = async (req, res) => {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: req.body.email,
  });

  // Sign a JWT token containing the customer ID
  const token = jwt.sign({ customerId: customer.id }, process.env.JWT_SECRET);

  // Set the JWT token as a cookie
  res.cookie('token', token, { maxAge: 900000, httpOnly: true });

  res.send({ customer: customer });
};




  export const createsubscription = async (req, res) => {
  // Read the JWT token from the cookie
  const token = req.cookies['token'];

  // Verify and decode the JWT token to extract the customer ID
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customerId = decoded.customerId;
  } catch (error) {
    return res.status(401).send({ error: { message: 'Unauthorized' } });
  }

  // Create the subscription
  const priceId = req.body.priceId;

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: priceId,
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
};


export const subscriptions = async (req, res) => {
  // Read the JWT token from the cookie
  const token = req.cookies['token'];

  // Verify and decode the JWT token to extract the customer ID
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customerId = decoded.customerId;
  } catch (error) {
    return res.status(401).send({ error: { message: 'Unauthorized' } });
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    expand: ['data.default_payment_method'],
  });

  res.json({subscriptions});
};



