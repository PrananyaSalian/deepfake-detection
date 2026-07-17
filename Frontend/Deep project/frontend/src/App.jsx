import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Upload from "./components/Upload";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {!user && !showSignup && (
        <Login setUser={setUser} setShowSignup={setShowSignup} />
      )}
      {!user && showSignup && (
        <Signup setShowSignup={setShowSignup} />
      )}
      {user && <Upload />}
    </div>
  );
}

export default App;
