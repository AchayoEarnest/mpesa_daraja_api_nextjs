import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { phone, amount } = req.body;

  // Get OAuth token
  const consumerKey = process.env.CONSUMER_KEY;
  const consumerSecret = process.env.CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  try {
    // Step 1: Get OAuth token
    const { data: tokenData } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const accessToken = tokenData.access_token;

    // Step 2: Make STK Push request
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3);
    const shortcode = process.env.SHORTCODE;
    const passkey = process.env.PASSKEY;
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    const stkPushData = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone, // Phone number sending the money
      PartyB: shortcode, // Your paybill number
      PhoneNumber: phone, // The customer's phone number
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: "Order123",
      TransactionDesc: "Payment for services",
    };

    const { data: stkResponse } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkPushData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.status(200).json(stkResponse);
  } catch (error) {
    console.error("Error making STK Push request:", error.response ? error.response.data : error.message);
    return res.status(500).json({ error: "STK Push request failed" });
  }
}