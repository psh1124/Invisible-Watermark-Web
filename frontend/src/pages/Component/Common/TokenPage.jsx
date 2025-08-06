import React from "react";
import { Link } from "react-router-dom";
import Layout from './Layout';
import "../../css/TokenPage.css";

const PurchaseToken = () => {
  return (
    <Layout>
      <div className="purchase-container">
        <div className="purchase-card">
          <h1>🔑 토큰 구매</h1>
          <p>더 강력한 워터마크 복원 기능을 사용하려면 토큰이 필요합니다.</p>
          <ul className="token-benefits">
            <li>✔️ 고해상도 이미지에서도 워터마크 검출 가능</li>
            <li>✔️ 빠르고 정확한 결과 제공</li>
            <li>✔️ 프리미엄 지원 제공</li>
          </ul>

          <div className="token-options">
            <button className="token-button">💳 1회권 (1,000원)</button>
            <button className="token-button">💳 5회권 (4,500원)</button>
            <button className="token-button">💳 무제한 월간권 (9,900원)</button>
          </div>

          <p className="go-back">
            <Link to="/">← 메인 페이지로 돌아가기</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PurchaseToken;
