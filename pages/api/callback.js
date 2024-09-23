export default function handler(req, res) {
    if (req.method === "POST") {
      const { Body } = req.body;
  
      // Handle the STK callback response here
      console.log("STK Callback Response:", Body);
  
      return res.status(200).json({ message: "Callback received" });
    } else {
      res.status(405).json({ message: "Only POST requests allowed" });
    }
  }