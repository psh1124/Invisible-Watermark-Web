import { Link } from "react-router-dom";
import React from "react";
import "../../css/ForgotPasswordPage.css";
import Layout from "./Layout";

const ForgotPasswordPage = () => {
  return (
    <Layout>
      <div className="forgot-container">
        <div className="forgot-card">
          <h2>비밀번호 재설정</h2>
          <form className="forgot-form">
            <div className="input-group">
              <div className="email"><label htmlFor="email">이메일 주소*</label></div>
              <div className="input-with-icon">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="이메일 주소를 입력하세요."
                  required
                />
                <span className="email-icon">&#9993;</span>
              </div>
            </div>
            <button type="submit" className="forgot-button">
              요청 보내기
            </button>
          </form>
          <p>
            <Link to="/login">로그인 페이지로 돌아가기</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;