import { useState } from "react";
import axios from "axios";

export default function Login({ setUser, setShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      if (res.data.success) {
        setUser(email);
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-96">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" className="border p-2 w-full mb-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white p-2 w-full" onClick={handleLogin}>Login</button>
      <p className="mt-2 text-sm cursor-pointer text-blue-500" onClick={() => setShowSignup(true)}>Don't have an account? Sign up</p>
    </div>
  );
}
