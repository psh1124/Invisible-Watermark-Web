import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Component/Common/Layout";
import "./css/Home.css";
import watermark1 from './image/watermark1.jpeg';
import watermark2 from './image/watermark2.jpeg';
import watermark3 from './image/watermark3.jpeg';
import lock from './icon/lock.svg';
import logo from '../assets/logo.png';
import image1 from './image/image1.jpeg';
import image2 from './image/image2.jpeg';
import image3 from './image/image3.jpeg';
import image4 from './image/image4.jpeg';
import image5 from './image/image5.jpeg';
import image6 from './image/image6.jpeg';

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [watermark1, watermark2, watermark3];

  useEffect(() => {
    const interval = setInterval(() => setCurrentImage(prev => (prev + 1) % images.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const protectionItems = [
    "기업의 정보보호", "개인 데이터 보안", "문서 및 파일 보호",
    "저작권 보호", "의료 기록 보안", "정부 문서 보호",
    "개인 데이터 보안", "문서 및 파일 보호"
  ];

  const allImages = [image1, image2, image3, image4, image5, image6];

  const characteristics = [
    { title: "비가시성", description: "워터마크는 원본의 형태를 훼손하지 않으며 눈에 보이지 않게 데이터를 보호합니다." },
    { title: "강한 내구성", description: "워터마크는 손상에 강하며, 시간이 지나도 유효성을 유지합니다." },
    { title: "유출 방지 효과", description: "파일이나 문서의 유출을 방지하고, 추적할 수 있습니다." },
    { title: "소유권 증명", description: "디지털 자산의 소유권을 증명할 수 있는 강력한 도구입니다." },
    { title: "유출자 추적 기능", description: "유출된 콘텐츠를 통해 유출자를 추적하고 책임을 물을 수 있습니다." },
    { title: "분쟁시 증거로 활용", description: "법적 분쟁에서 중요한 증거로 활용할 수 있습니다." }
  ];

  return (
    <Layout>
      <div className="Home_container">
        <div className="Home_left_side"></div>
        <div className="Home_center_side">
          <h2 className="title">비가시성 워터마크로 지키는 안전한 콘텐츠</h2>
          <h1 className="main-title">WaterMark AI Free</h1>
          <p className="subtitle">
            눈에 보이지 않는 워터마크를 생성하여 콘텐츠를 보호하고 유출자를 추적할 수 있습니다.
          </p>

          <Link to="/free">
            <button className="free_start_button">무료로 시작</button>
          </Link>

          <div className="Home_watermark_explain">
            <h1>비가시성 워터마크란?</h1>
            <p>비가시성 워터마크는 원본의 형태를 훼손하지 않으며, 유출자 추적이 가능합니다.</p>
          </div>

          <div className="image-slider">
            <div className="slider-images" style={{ transform: `translateX(-${currentImage * 100}%)` }}>
              {images.map((img, index) => <img key={index} className="main_image" src={img} alt="Watermark" />)}
            </div>
          </div>

          <h2 className="how">어떻게 사용하나요?</h2>
          <div className="steps">
            {["파일 업로드", "식별 정보 입력", "유출된 파일 검출"].map((desc, index) => (
              <div key={index} className="step">
                <img src={watermark1} alt={`STEP ${index + 1}`} />
                <h3>STEP {index + 1}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>

          <div className="icons-container">
            <div className="icons">
              {protectionItems.map((text, index) => (
                <React.Fragment key={index}> {/* key를 추가 */}
                  {index === 4 && (
                    <div key="logo" className="icon-item">
                      <img src={logo} className="logo-image" />
                    </div>
                  )}
                  <div key={index} className="icon-item">
                    <img src={lock} alt="Protection Icon" className="svg-image" />
                    <span>{text}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="yoons">
            {characteristics.map((item, index) => (
              <div key={index} className="yoon"> {/* key를 추가 */}
                <img src={allImages[index]} alt={`Characteristic ${index + 1}`} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>

          <div className="free">
            <h2>지금 가입하고 무료로 시작하세요</h2>
            <h3>Watermark AI로 내 콘텐츠를 안전하게 보호하세요!</h3>
            <button>무료로 시작</button>
          </div>

        </div>
        <div className="Home_right_side"></div>
      </div>
    </Layout>
  );
};

export default Home;