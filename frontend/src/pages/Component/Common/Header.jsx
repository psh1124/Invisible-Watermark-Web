import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Header.css";
import logo from "../../../assets/logo.png";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const [isUserChecked, setIsUserChecked] = useState(false);
  const { i18n, t } = useTranslation();
  const [showHeader, setShowHeader] = useState(true);

  const lastScrollY = useRef(0);

  const handleLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const cookies = document.cookie;
      if (!cookies.includes("username")) {
        setIsUserChecked(true);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/User/Info`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.username) {
            setUsername(data.username);
            localStorage.setItem("username", data.username);
          } else {
            localStorage.removeItem("username");
          }
        } else {
          localStorage.removeItem("username");
        }
      } catch (err) {
        console.error("유저 정보 요청 중 오류 발생:", err);
        localStorage.removeItem("username");
      } finally {
        setIsUserChecked(true);
      }
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    const threshold = 30;
    const hideOffset = 500;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY.current) < threshold) {
        return;
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > hideOffset) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const fingerprint = localStorage.getItem("fingerprint");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/Logout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, fingerprint }),
        }
      );

      setUsername(null);
      localStorage.removeItem("username");
      alert(t("header.logoutAlert"));
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
    <header className={`header ${showHeader ? "" : "hidden"}`}>
      <Link className="header_logo" to="/">
        <img src={logo} alt="Logo" />
        <p>Watermark AI</p>
      </Link>

      <div className="header_right">
        <nav className="nav_links">
          <Link className="nav_link" to="/embed">
            {t("header.embed")}
          </Link>
          <Link className="nav_link" to="/detect">
            {t("header.detect")}
          </Link>
          <Link className="nav_link" to="/mypage">
            {t("header.mypage")}
          </Link>
          <Link className="nav_link" to="/api">
            {t("header.api")}
          </Link>
          <Link className="nav_link" to="/plan">
            {t("header.plan")}
          </Link>
        </nav>
      </div>

      <div className="auth_buttons">
        {!isUserChecked ? null : username ? (
          <div className="user-info-wrapper">
            <div className="user-info-left">
              <span className="welcome-text">{t("header.welcome", { username })}</span>
              <div className="token">
                <span className="token-count">💰 {t("header.tokenCount")}</span>
                <Link className="purchase-link" to="/token">
                  {t("header.purchaseToken")}
                </Link>
              </div>
            </div>
            <button className="auth_btn logout" onClick={handleLogout}>
              {t("header.logout")}
            </button>
          </div>
        ) : (
          <>
            <Link className="auth_btn login" to="/login">
              {t("header.login")}
            </Link>
            <Link className="auth_btn signup" to="/signup">
              {t("header.signup")}
            </Link>
          </>
        )}
      </div>

      <select onChange={handleLangChange} value={i18n.language}>
        <option value="ko">한국어</option>
        <option value="en">English</option>
      </select>
    </header>
  );
};

export default Header;
