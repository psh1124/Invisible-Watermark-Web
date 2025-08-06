import { useState } from 'react';
import Layout from './Layout';
import { FiUploadCloud } from 'react-icons/fi';
import '../../css/DetectPage.css';
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useTranslation } from 'react-i18next';

const DetectPage = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [finalImage, setFinalImage] = useState('');
  const [dragging, setDragging] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isDetectLoading, setIsDetectLoading] = useState(false);
  const [isVipDetectLoading, setIsVipDetectLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const [detectedInfo, setDetectedInfo] = useState(null);
  const [errorLog, setErrorLog] = useState('');

  const supportedFormats = ['image/png', 'image/jpeg', 'image/jpg'];
  const maxFileSize = 30 * 1024 * 1024; // 30MB

  const getFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    return (result.visitorId);
  };

  const handleFileChange = async (file) => {
    setDetectedInfo(null);
    if (!file) return;

    if (!supportedFormats.includes(file.type)) {
      alert(t('detectPage.unsupportedFormatAlert'));
      return;
    }

    if (file.size > maxFileSize) {
      alert(t('detectPage.fileSizeExceedAlert'));
      return;
    }

    setIsPreviewLoading(true);
    const success = await handleAdditionalPost(file);
    setPreviewImage('');
    setIsPreviewLoading(false);

    if (success) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setFinalImage('');
      setIsSuccess(null);
      setDetectedInfo(null);
      setErrorLog('');
    } else {
      setPreviewImage('');
      setSelectedFile(null);
    }
  };


  const authlogin = async () => {
    const fingerprint = await getFingerprint();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/AuthLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error('AuthLogin failed');
      }

      console.log('재로그인 성공');
      return true;
    } catch (err) {
      console.error("로그인 오류:", err);
      return false;
    }
  };

  const handleAdditionalPost = async (file) => {
    try {
      const formData = new FormData();
      formData.append('imgfile', file);

      const response = await fetch(`${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/User/DetectingFace`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // 세션 유지용
      });

      const text = await response.text();

      if (!response.ok) {
        const error = new Error(`서버 오류: ${text}`);
        error.status = response.status;  // 상태 코드 포함
        throw error;
      }

      if (text === "Face not detected") {
        alert('이 이미지는 호환되지 않습니다.');
        setPreviewImage('');
        return false;
      } else if (text === "Detecting Success") {
        console.log('얼굴 인식 성공');
        return true;
      } else {
        console.warn('알 수 없는 응답:', text);
        return false;
      }
    } catch (error) {
      if (error.status === 401) {
        console.warn('토큰 만료로 재로그인 시도');
        const reloginSuccess = await authlogin();
        if (reloginSuccess) {
          return await handleAdditionalPost(file); // 재시도 1회
        } else {
          throw new Error('재로그인 실패');
        }
      }

      console.error('요청 중 네트워크 오류 발생:', error);
      return false;
    }
  };

  const handleRequest = async () => {
    if (!selectedFile) {
      alert('이미지를 먼저 업로드하세요.');
      return;
    }

    setIsDetectLoading(true);
    setIsSuccess(null);
    setFinalImage('');
    setDetectedInfo(null);
    setErrorLog('');

    const formData = new FormData();
    formData.append('imgfile', selectedFile);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/User/DecodeWaterMark`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API 응답 데이터:', data);

      if (response.ok) {
        setIsSuccess(true);
        setDetectedInfo({
          username: data.username,
          createdAt: data.createdAt,
          hash: data.hash,
          text: data.text,
        });

        setFinalImage(data.imageUrl || '');
        setErrorLog('');
      }
    } catch (error) {
      console.error('API 요청 중 오류:', error);
      setIsSuccess(false);
      setDetectedInfo(null);
      setErrorLog('토큰을 사용하여 더 좋은 버전으로 시도해 보시겠습니까? 👉 1회당 토큰 2개 사용');
    } finally {
      setIsDetectLoading(false);
    }
  };
  const handleVipRequest = async () => {
    if (!selectedFile) {
      alert('이미지를 먼저 업로드하세요.');
      return;
    }

    setIsVipDetectLoading(true);

    const formData = new FormData();
    formData.append('imgfile', selectedFile);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/User/DecodeWaterMarkVIP`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setDetectedInfo({
          username: data.username,
          createdAt: data.createdAt,
          hash: data.hash,
          text: data.text,
        });
        setFinalImage(data.imageUrl || '');
        setErrorLog('');
      }
    } catch (error) {
      console.error('VIP API 요청 중 오류:', error);
      setIsSuccess(false);
      setDetectedInfo(null);
      setErrorLog('VIP 토큰이 부족합니다. 충전 후 이용하세요.');
    } finally {
      console.log('로딩 상태 false');
      setIsVipDetectLoading(false);
    }
  };

  return (
    <Layout>
      <div className="detect-page-wrapper">
        <h1 className="detect-title">{t('detectPage.title')}</h1>
        <p className="detect-subtitle">{t('detectPage.subtitle')}</p>
        <p className="detect-subtitle">{t('detectPage.description')}</p>

        <div
          className={`detect-upload-card ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            handleFileChange(file);
          }}
        >
          {previewImage && !isPreviewLoading ? (
            <img
              src={previewImage}
              alt={t('detectPage.previewAlt')}
              className="preview-image"
              onLoad={() => setIsPreviewLoading(false)}
              onError={() => setIsPreviewLoading(false)}
            />
          ) : isPreviewLoading ? (
            <div className="preview-loading">
              <div className="spin" />
              <p>{t('detectPage.detectingFace')}</p>
            </div>
          ) : (
            <>
              <FiUploadCloud size={40} color="#888" />
              <p className="upload-text">{t('detectPage.uploadInstruction')}</p>
              <p className="upload-sub">{t('detectPage.uploadSubInstruction')}</p>
            </>
          )}

          <input
            type="file"
            accept="image/png, image/jpeg"
            id="fileUpload"
            hidden
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          <label htmlFor="fileUpload" className="upload-btn">
            {t('detectPage.selectFile')}
          </label>
        </div>

        <div className="detect-info-table">
          <h3>{t('detectPage.supportedFilesTitle')}</h3>
          <table>
            <thead>
              <tr>
                <th>{t('detectPage.table.type')}</th>
                <th>{t('detectPage.table.fileFormat')}</th>
                <th>{t('detectPage.table.minSize')}</th>
                <th>{t('detectPage.table.minResolution')}</th>
                <th>{t('detectPage.table.maxSize')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t('detectPage.table.image')}</td>
                <td>JPEG, PNG, JPG</td>
                <td>10 KB</td>
                <td>512 x 512</td>
                <td>5000 x 5000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          className="detect-action-button"
          onClick={handleRequest}
          disabled={isDetectLoading || isVipDetectLoading}
        >
          {isDetectLoading
            ? <>
              <span className="detect-spinner"></span> {t('detectPage.detecting')}
            </>
            : isVipDetectLoading
              ? t('detectPage.vipDetecting')
              : t('detectPage.detect')}
        </button>

        {isSuccess === true && detectedInfo && (
          <div className="result-message success">
            ✅ {t('detectPage.detectedDataFound')}
            <p>
              🔍 {t('detectPage.watermarkTracker')}: <strong>{detectedInfo.username}</strong>
            </p>
            <p>
              🕒 {t('detectPage.detectTime')}: <strong>{new Date(detectedInfo.createdAt).toLocaleString()}</strong>
            </p>
            <p>
              🧬 {t('detectPage.watermarkHash')}: <strong>{detectedInfo.hash}</strong>
            </p>
            <p>
              💬 {t('detectPage.insertedText')}: <strong>{detectedInfo.text}</strong>
            </p>
            <p>
              📁 {t('detectPage.originalFileName')}: <strong>{selectedFile.name}</strong>
            </p>
          </div>
        )}

        {isSuccess === false && (
          <div className="result-message failure">
            ❌ {t('detectPage.restoreFail')}
            {errorLog && (
              <>
                <p className="error-log">{errorLog}</p>
                {errorLog.includes('토큰') && (
                  <div className="vip-suggestion-card">
                    <p>
                      🔑 <strong>{t('detectPage.vipRestoreFeature')}</strong> {t('detectPage.moreAccurateAnalysis')}
                    </p>
                    <p>
                      💰 <em>{t('detectPage.tokenUsage')}</em>
                    </p>
                    <button
                      className="vip-button"
                      onClick={handleVipRequest}
                      disabled={isVipDetectLoading}
                    >
                      {isVipDetectLoading ? t('detectPage.vipDetecting') : t('detectPage.vipDetectButton')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DetectPage;