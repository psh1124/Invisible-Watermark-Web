// Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Component/Common/Layout";
import "./css/Home.css";
import {
  watermark1, watermark2, watermark3, step1, step2, step3,
  image1, image2, image3, image4, image5, image6,
} from './image/index';
import lock from './icon/lock.svg';
import logo from '../assets/logo.png';
import { useTranslation } from "react-i18next";
import TopButton from './Component/Common/TopButton.jsx';
import useScrollAnimation from "../hooks/useScrollAnimation";

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [watermark1, watermark2, watermark3];

  const { t } = useTranslation();
  const steps = t('steps', { returnObjects: true });
  const protectionItems = t("protectionItems", { returnObjects: true });
  const characteristics = t("characteristics", { returnObjects: true });

  const stepImages = [step1, step2, step3];
  const allImages = [image1, image2, image3, image4, image5, image6];

  useScrollAnimation();

  useEffect(() => {
    const interval = setInterval(() => setCurrentImage(prev => (prev + 1) % images.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="Home_container">
        <div className="Home_left_side"></div>
        <div className="Home_center_side">
          <h2 className="title fade-up">{t("title")}</h2>
          <h1 className="main-title fade-up">{t("mainTitle")}</h1>
          <p className="subtitle fade-up">{t("subtitle")}</p>

          <Link to="/embed">
            <button className="free_start_button fade-up">{t("startFree")}</button>
          </Link>

          <div className="Home_watermark_explain fade-up">
            <h1>{t("watermarkWhatIs")}</h1>
            <p>{t("watermarkDescription")}</p>
          </div>

          <div className="image-slider fade-up">
            <div className="slider-images" style={{ transform: `translateX(-${currentImage * 100}%)` }}>
              {images.map((img, index) => <img key={index} className="main_image" src={img} alt="Watermark" />)}
            </div>
          </div>

          <h2 className="how fade-up">{t("how")}</h2>
          <div className="steps fade-up">
            {steps.map((desc, index) => (
              <div key={index} className="step fade-up">
                <img src={stepImages[index]} alt={`STEP ${index + 1}`} />
                <h3>STEP {index + 1}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>

          <div className="icons-container fade-up">
            <div className="icons">
              {protectionItems.map((text, index) => (
                <React.Fragment key={index}>
                  {index === 4 && (
                    <div key="logo" className="icon-item fade-up">
                      <img src={logo} className="logo-image" />
                    </div>
                  )}
                  <div key={index} className="icon-item fade-up">
                    <img src={lock} alt="Protection Icon" className="svg-image" />
                    <span>{text}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="yoons fade-up">
            {characteristics.map((item, index) => (
              <div key={index} className="yoon fade-up">
                <img src={allImages[index]} alt={`Characteristic ${index + 1}`} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>

          <div className="free fade-up">
            <h2>{t("ctaTitle")}</h2>
            <h3>{t("ctaSubtitle")}</h3>
            <button>{t("startFree")}</button>
          </div>

          <TopButton />
        </div>
        <div className="Home_right_side"></div>
      </div>
    </Layout>
  );
};

export default Home;
