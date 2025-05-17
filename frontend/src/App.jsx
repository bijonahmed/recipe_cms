import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import AppRouter from "./rotuer";
import { useNavigate } from 'react-router-dom';
import AuthUser from "./components/AuthUser";


function App() {
  const navigate = useNavigate();
  const { user } = AuthUser();


  return (
    <div>
      <AppRouter />
    </div>
  );
}

export default App;
