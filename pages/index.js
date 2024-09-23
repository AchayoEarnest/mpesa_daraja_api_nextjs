import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/stkpush", {
        phone,
        amount,
      });
      setMessage("STK Push sent. Please check your phone.");
    } catch (error) {
      setMessage("Error sending STK Push.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-24">
      <div className="flex flex-col gap-5 w-full bg-blue-500 p-6 w-1/2 ">
        <h1 className="font-bold">Pay Winam via M-Pesa</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <label>Phone Number (2547XXXXXXXX)</label>
            <input
              className="h-10 text-gray-800 p-2"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-3">
            <label>Amount</label>
            <input
              className="h-10 text-gray-800 p-2"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-800 w-1/4 h-10 rounded"
          >
            {loading ? "Sending..." : "Pay Now"}
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
