import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Header.css";
import logo from "../../../assets/logo.png";

const Header = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  const getUserInfo = async () => {

    const cookies = document.cookie;
    if (!cookies.includes("username")) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/User/Info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.username) {
          setUsername(data.username);
          localStorage.setItem("username", data.username);
        }
      } else {
        console.warn("유저 정보 요청 실패:", response.status);
      }
    } catch (err) {
      console.error("유저 정보 요청 중 오류 발생:", err);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    getUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      const fingerprint = localStorage.getItem("fingerprint");

      const response = await fetch(`${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/Logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          fingerprint,
        }),
      });

      setUsername(null);
      localStorage.removeItem("username");
      alert("로그아웃 되었습니다.");
      navigate("/");

      if (!response.ok) {
        const errorText = await response.text();
        console.warn("서버 응답 오류:", errorText);
      }
    } catch (err) {
      console.error("로그아웃 중 예외 발생:", err);
    }
  };


  return (
    <div className="header_container">
      <div className="header_top">Safe Content For Us</div>

      <header className="header">
        <Link className="header_logo" to="/">
          <img src={logo} alt="Logo" />
          <p>Watermark AI</p>
        </Link>

        <div className="header_right">
          <nav className="nav_links">
            <Link className="nav_link" to="/embed">Watermark Embedding</Link>
            <Link className="nav_link" to="/detect">Watermark Detection</Link>
          </nav>

          <div className="auth_buttons">
            {username ? (
              <>
                <span className="welcome-text">{username}님<br /> 환영합니다!</span>
                <button className="auth_btn logout" onClick={handleLogout}>로그아웃</button>
              </>
            ) : (
              <>
                <Link className="auth_btn login" to="/login">로그인</Link>
                <Link className="auth_btn signup" to="/signup">회원가입</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;