import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import Swal from "sweetalert2";

const Index = () => {
  const baseURL = axios.defaults.baseURL;
  const [amount, setAmount] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [walletAddressResponse, setWalletAddressResponse] = useState("");
  const [responseData, setSuccessResponse] = useState(null);
  const [errors, setErrors] = useState({});

  const endpointStyle = {
    backgroundColor: '#f9f9f9',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const linkStyle = {
    color: '#007bff',
    textDecoration: 'none',
  };

  const parameterStyle = {
    backgroundColor: '#f9f9f9',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const sectionTitleStyle = {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#333',
  };


  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const getwalleteAddress = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/address/getwalleteAddress", {
        params: {
          api_key: apiKey,
          password: password,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Fetech has been successful.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      // Reset form fields after success
      setWalletAddressResponse(response.data);

    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errorData = error.response.data.errors;
        // Assuming you are using React state to manage the errors
        setErrors(errorData);
        // For showing the error message in the UI:
        if (Object.keys(errors).length > 0) {
          return (
            <div className="alert alert-danger mt-3">
              {Object.values(errors).map((err, index) => (
                <div key={index}>
                  {err.map((message, idx) => (
                    <div key={idx}>{message}</div>
                  ))}
                </div>
              ))}
            </div>
          );
        }
      }
      else {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: error.message || "Please try again later.",
        });
      }
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({}); // Clear previous errors

    try {
      const formData = {
        amount,
        api_key: apiKey,
        password,
      };
      const response = await axios.post("/payment/makeDepositDemo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Fetech has been successful.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      // Reset form fields after success
      setSuccessResponse(response.data);
      //setAmount("");
      //setApiKey("");
      //setPassword("");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errorData = error.response.data.errors;
        // Assuming you are using React state to manage the errors
        setErrors(errorData);
        // For showing the error message in the UI:
        if (Object.keys(errors).length > 0) {
          return (
            <div className="alert alert-danger mt-3">
              {Object.values(errors).map((err, index) => (
                <div key={index}>
                  {err.map((message, idx) => (
                    <div key={idx}>{message}</div>
                  ))}
                </div>
              ))}
            </div>
          );
        }
      }
      else {
        // General errors
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: error.message || "Please try again later.",
        });
      }
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Crypto Payment Checker.
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        {Object.keys(errors).length > 0 && (
          <div className="alert alert-danger mt-3">
            {Object.values(errors).map((err, index) => (
              <div key={index}>
                {err.map((message, idx) => (
                  <div key={idx}>{message}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Start */}
        <div style={{ width: '100%', margin: '30px auto', padding: '20px', backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>

          <div className="row">
            <div className="col-md-6">
              <div>
                <div style={endpointStyle}>
                  <p><strong>End Point (Development):</strong></p>
                  <p><a href="#" target="_blank" style={linkStyle}>{baseURL}/payment/makeDepositDemo</a></p>
                  <p><strong>End Point (Production):</strong></p>
                  <p><a href="#" target="_blank" style={linkStyle}>{baseURL}/payment/makeDeposit</a></p>


                </div>

              </div>
            </div>

            <div className="col-md-6">

              <p><strong>Get Wallet Address:</strong></p>

              <div>
                <label htmlFor="apiKey">API Key:</label>
                <input
                  type="text"
                  id="apiKey"
                  autoComplete="off"
                  className="form-control form-control-sm"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API key"
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  className="form-control form-control-sm"
                  value={password}
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>

             

              <button type="button" className="mt-3" onClick={getwalleteAddress} disabled={loading}>{loading ? "Processing..." : "Get Address"} </button>
              <p>End Point (Get Method)&nbsp;<a href="#" target="_blank" style={linkStyle}>{baseURL}/address/getwalleteAddress</a> </p>
              <h5 className="text-secondary">Response:</h5>
              {JSON.stringify(walletAddressResponse, (key, value) => value === "" ? null : value, 2)}
            </div>

          </div>

          <div>
            <p style={sectionTitleStyle}>Post Form data</p>

            <div style={parameterStyle}>
              Request : <pre>
                `&#123;
                &quot;amount&quot;: 500.00,
                &quot;api_key&quot;: &quot;your_api_key_here&quot;,
                &quot;password&quot;: &quot;your_password_here&quot;
                &#125;`
              </pre>
            </div>
          </div>
          <hr />
          <div className="container mt-4">
            <div className="row">
              {/* Left Column for the Form */}
              <div className="col-md-6">
                <form onSubmit={handleSubmit}>
                  <label htmlFor="amount" className="form-label text-secondary">
                    Deposit Amount
                  </label>
                  <input
                    type="text"
                    id="amount"
                    className="form-control form-control-sm"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Enter amount"
                  />

                  <label htmlFor="apiKey" className="form-label text-secondary">
                    API Key
                  </label>
                  <input
                    type="text"
                    id="apiKey"
                    autoComplete="off"
                    className="form-control form-control-sm"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter API key"
                  />

                  <label htmlFor="password" className="form-label text-secondary">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control form-control-sm"
                    value={password}
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-3"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Submit"}
                  </button>
                </form>
              </div>

              {/* Right Column for the Response */}
              <div className="col-md-6">
                {/* Replace the below code with your actual response content */}
                <div className="border p-3 rounded">
                  <h5 className="text-secondary">Response:</h5>
                  <pre>{JSON.stringify(responseData, null, 2)}</pre> {/* Example response data */}


                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-4 text-center text-muted text-bg-danger text-white">
          <small>
            <strong style={{ color: 'white' }}>Note:</strong> <span style={{ color: 'white' }}>This deposit form is for test purposes only.</span>
          </small>
        </div>

        {/* END */}

      </div>

    </div>
  );
};

export default Index;
