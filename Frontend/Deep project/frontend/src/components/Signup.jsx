import { useState } from "react";
import axios from "axios";

export default function Signup({ setShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/signup", { email, password });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-96">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {message && <p className="text-green-500">{message}</p>}
      <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" className="border p-2 w-full mb-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-green-500 text-white p-2 w-full" onClick={handleSignup}>Sign Up</button>
      <p className="mt-2 text-sm cursor-pointer text-blue-500" onClick={() => setShowSignup(false)}>Already have an account? Login</p>
    </div>
  );
}
