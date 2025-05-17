import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import AppRouter from "./rotuer";
import { useNavigate } from 'react-router-dom';
import AuthUser from "./components/AuthUser";


function App() {
  const navigate = useNavigate();
  const { user } = AuthUser();

  useEffect(() => {
    if (!user) {
      navigate('/'); // Redirect to the login page if `user` is null or undefined
    }
  }, []); // The effect depends on the `user` and `navigate`

  return (
    <div>
      <AppRouter />
    </div>
  );
}

export default App;
