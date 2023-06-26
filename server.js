require("dotenv").config();
const env = process.env;

const express = require("express");
const app = express();
// This is your test secret API key.
const stripe = require("stripe")(env.STRIPE_SECRET_KEY);

app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "jpy",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/create-setup-intent", async (req, res) => {
  const setupIntent = await stripe.setupIntent.create({});
  res.send({
    clientSecret: setupIntent.client_secret,
  });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
