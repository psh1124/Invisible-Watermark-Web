import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Layout from "./Layout";
import React, { useState, useEffect } from 'react';
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import "../../css/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const getFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    return (result.visitorId);
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
          alert("로그인 성공!");
          localStorage.setItem("username", loginData.username);
          navigate("/");
        } else {
          console.error("예상하지 못한 응답:", textResponse);
          setError("로그인 실패: 예상치 못한 응답");
        }
      } else {
        const text = await response.text();
        console.error("서버 응답:", text);
        setError("로그인 실패: " + response.status);
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      setError("서버와 연결할 수 없습니다.");
    }
  };

  return (
    <Layout>
      <div className="login-container">
        <div className="login-card">
          <h2>로그인</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">아이디</label>
              <input type="text" id="username" name="username" placeholder="아이디를 입력하세요" required onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="password">비밀번호</label>
              <input type="password" id="password" name="password" placeholder="비밀번호를 입력하세요" required onChange={handleChange} />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">로그인</button>
          </form>

          <div className="Signup_container">
            <p><Link to="/Signup">회원가입</Link></p>
            <p><Link to="/Forgot">비밀번호를 잊으셨나요?</Link></p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;