import { Link } from "react-router-dom";
import React, { useState } from "react";
import "../../css/ForgotPasswordPage.css";
import Layout from "./Layout";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('이메일을 입력해주세요.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/PostEmail`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.text();
      console.log("응답:", result);

      if (response.ok) {
        setSuccessMessage('비밀번호 재설정 이메일이 전송되었습니다.');
        setErrorMessage('');
      } else {
        setErrorMessage('이메일 전송에 실패했습니다. 다시 시도해주세요.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error("이메일 전송 오류:", error);
      setErrorMessage('서버 오류가 발생했습니다.');
      setSuccessMessage('');
    }
  };

  return (
    <Layout>
      <div className="forgot-container">
        <div className="forgot-card">
          <h2>비밀번호 재설정</h2>
          <form className="forgot-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email" className="email-label">이메일 주소*</label>
              <div className="input-with-icon">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="이메일 주소를 입력하세요."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="email-icon">&#9993;</span>
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
            <button type="submit" className="forgot-button">요청 보내기</button>
          </form>
          <p className="back-to-login">
            <Link to="/login">로그인 페이지로 돌아가기</Link>
          </p>
        </div>
      </div> 
    </Layout>
  );
};

export default ForgotPasswordPage;