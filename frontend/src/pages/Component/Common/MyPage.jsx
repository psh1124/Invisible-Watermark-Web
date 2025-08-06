import { useState, useEffect } from 'react';
import Layout from './Layout';
import '../../css/MyPage.css';
import { FiKey, FiBookOpen, FiPieChart, FiUser, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const MyPage = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState(null);
    const [isUserChecked, setIsUserChecked] = useState(false);

    const getUserInfo = async () => {

        const cookies = document.cookie;
        if (!cookies.includes("username")) {
            return;
        }

        // try {
        //     const response = await fetch(`${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/User/Info`, {
        //         method: "GET",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         credentials: "include",
        //     });

        //     if (response.ok) {
        //         const data = await response.json();
        //         if (data.username) {
        //             setUsername(data.username);
        //             localStorage.setItem("username", data.username);
        //         }
        //     } else {
        //         console.warn("유저 정보 요청 실패:", response.status);
        //     }
        // } catch (err) {
        //     console.error("유저 정보 요청 중 오류 발생:", err);
        // }
    };

    useEffect(() => {
        const getUserInfo = async () => {
            const cookies = document.cookie;
            if (!cookies.includes("username")) {
                setIsUserChecked(true); // ✅ 검증 완료
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
                setIsUserChecked(true); // ✅ 무조건 완료
            }
        };

        getUserInfo();
    }, []);

    return (
        <Layout>
            <div className="mypage-container">
                <div className="mypage-header">
                    <h2>{t('myPage.title')}</h2>
                </div>

                <div className="mypage-profile">
                    <div className="profile-info">
                        <h3>{username || t('myPage.missingUserInfo')}</h3>
                        {/* 유저네임만 임시로 누락상태, 이메일이랑 토큰도 독같이  서버에서 못받아오면 누락으로 ㄱㄱㄱ*/}
                        <p>hong@example.com</p>
                        <span className="token-count">{t('myPage.tokenCount', { count: 12 })}</span>
                    </div>
                </div>

                <div className="mypage-menu">
                    <Link className="menu-item" to="../api"><FiKey /> {t('myPage.apiKeyManagement')}</Link>
                    <div className="menu-item"><FiBookOpen /> {t('myPage.apiGuide')}</div>
                    <div className="menu-item"><FiPieChart /> {t('myPage.dashboard')}</div>
                    <div className="menu-item"><FiUser /> {t('myPage.accountManagement')}</div>
                    <div className="menu-item"><FiHelpCircle /> {t('myPage.contact')}</div>
                </div>

                <div className="mypage-footer">
                    <button className="logout-btn"><FiLogOut /> {t('myPage.logout')}</button>
                </div>
            </div>
        </Layout>
    );
};

export default MyPage;