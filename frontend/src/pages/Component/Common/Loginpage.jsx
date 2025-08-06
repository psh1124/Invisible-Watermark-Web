import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import React, { useState } from 'react';
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import "../../css/LoginPage.css";
import logo from "../../../assets/logo.png";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const getFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  };

  const handleChange = (e) => {
    setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fingerprint = await getFingerprint();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...loginData, fingerprint }),
        credentials: "include",
      });

      if (response.ok) {
        const textResponse = await response.text();

        if (textResponse === "Login successful") {
          alert(t("login.success"));
          localStorage.setItem("username", loginData.username);
          navigate("/");
        } else {
          console.error("Unexpected response:", textResponse);
          setError(t("login.unexpectedError"));
        }
      } else {
        const text = await response.text();
        console.error("Server response:", text);
        setError(`${t("login.failed")}: ${response.status}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(t("login.connectionError"));
    }
  };

  return (
    <Layout>
      <div className="login-container">
        <div className="login-card">
          <header className="login_header">
            <div className="login_header_logo">
              <img src={logo} alt="Logo" />
              <p>Watermark AI</p>
            </div>
          </header>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">{t("login.username")}</label>
              <input type="text" id="username" name="username" placeholder={t("login.usernamePlaceholder")} required onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="password">{t("login.password")}</label>
              <input type="password" id="password" name="password" placeholder={t("login.passwordPlaceholder")} required onChange={handleChange} />
              <p>
                <Link to="/Forgot" className="forgot_password">
                  {t("login.forgotPassword")}
                </Link>
              </p>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">{t("login.loginButton")}</button>
            <p>
              <Link to="/Signup" className="notmember">
                {t("login.notMember")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;