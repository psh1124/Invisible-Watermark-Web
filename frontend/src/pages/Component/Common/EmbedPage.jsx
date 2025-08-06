import { useState } from 'react';
import Layout from './Layout';
import '../../css/EmbedPage.css';
import { FiUploadCloud } from 'react-icons/fi';
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useTranslation } from 'react-i18next';

const InsertPage = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [descriptions, setDescriptions] = useState([""]);
  const [warning, setWarning] = useState('');
  const [resultImage, setResultImage] = useState(null);
  const [isDetectingFace, setIsDetectingFace] = useState(false);
  const [isEmbeddingWatermark, setIsEmbeddingWatermark] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const supportedFormats = ['image/png', 'image/jpeg', 'image/jpg'];
  const maxFileSize = 30 * 1024 * 1024;

  const handleChange = (index, value) => {
    const updated = [...descriptions];
    updated[index] = value;
    setDescriptions(updated);
  };

  const handleAdd = () => {
    if (descriptions.length >= 10) return;
    setDescriptions([...descriptions, '']);
  };

  const getFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    return (result.visitorId);
  };

  const handleRemove = (index) => {
    if (descriptions.length === 1) {
      setWarning(t('insertPage.minimumOneWatermark'));
      return;
    }
    const updated = descriptions.filter((_, i) => i !== index);
    setDescriptions(updated);
    setWarning('');
  };

  const handleFileChange = async (file) => {
    if (!file) return;

    if (!supportedFormats.includes(file.type)) {
      alert(t('insertPage.supportedFormatsAlert'));
      return;
    }

    if (file.size > maxFileSize) {
      alert(t('insertPage.maxFileSizeAlert'));
      return;
    }

    setIsDetectingFace(true);

    const isSuccess = await handleAdditionalPost(file);
    setIsDetectingFace(false);

    if (!isSuccess) {
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setFileInfo({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
    });
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
        credentials: 'include',
      });

      const text = await response.text();

      if (!response.ok) {
        const error = new Error(`서버 오류: ${text}`);
        error.status = response.status;
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
          return await handleAdditionalPost(file);
        } else {
          throw new Error('재로그인 실패');
        }
      }

      console.error('요청 중 네트워크 오류 발생:', error);
      return false;
    }
  };


  const handleSubmit = async () => {
    if (!selectedFile || descriptions.every(desc => desc.trim() === '')) {
      alert(t('insertPage.fillFileAndDescription'));
      return;
    }

    const username = localStorage.getItem('username');
    if (!username) {
      alert(t('insertPage.noLoginInfo'));
      return;
    }

    const payload = JSON.stringify({ username, text: descriptions.join(", ") });

    const formData = new FormData();
    formData.append('imgfile', selectedFile);
    formData.append('data', payload);

    setIsEmbeddingWatermark(true);
    setSuccessMessage(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/User/EmbedWaterMark`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`서버 오류: ${errorText}`);
        error.status = response.status;
        throw error;
      }

      const result = await response.blob();
      const downloadUrl = URL.createObjectURL(result);
      setResultImage(downloadUrl);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 2000);
    } catch (error) {

      if (error.status === 401) {
        console.warn('토큰 만료로 재로그인 시도');
        const reloginSuccess = await authlogin();
        if (reloginSuccess) {
          return await handleSubmit(true);
        } else {
          throw new Error('재로그인 실패');
        }
      }
      console.error('워터마크 삽입 실패:', error);
      alert('워터마크 삽입에 실패했습니다.');
    } finally {
      setIsEmbeddingWatermark(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'watermarked-image.png';
    link.click();
  };

  return (
    <Layout>
      <div className="insert-page-wrapper">
        <h1 className="embed-title">{t('insertPage.title')}</h1>
        <p className="subtitle">{t('insertPage.subtitle')}</p>

        <div className="horizontal-container">
          <div className={`upload-card ${dragging ? 'dragging' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setDragging(false);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files[0];
              handleFileChange(file);
            }}
          >
            <div className="upload-preview-container">
              <div className="image-box">
                {isDetectingFace ? (
                  <div className="preview-loading">
                    <div className="spin" />
                    <p>{t('insertPage.detectingFace')}</p>
                  </div>
                ) : previewImage ? (
                  <>
                    <img src={previewImage} alt={t('insertPage.previewAlt')} className="preview-image" />
                    <p className="preview-label">{t('insertPage.originalImage')}</p>
                  </>
                ) : (
                  <div className="upload-placeholder">
                    <FiUploadCloud size={40} color="#888" />
                    <p className="upload-text">{t('insertPage.uploadInstruction')}</p>
                    <p className="upload-sub">{t('insertPage.uploadSubInstruction')}</p>
                  </div>
                )}

                <label htmlFor="fileUpload" className="upload-btn">{t('insertPage.selectFile')}</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  id="fileUpload"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  hidden
                />
              </div>

              <div className="image-box">
                {resultImage ? (
                  <>
                    <img src={resultImage} alt={t('insertPage.resultAlt')} className="preview-image" />
                    <p className="preview-label">{t('insertPage.resultImage')}</p>
                  </>
                ) : (
                  <div className="upload-placeholder no-border">
                    <p className="upload-sub2">{t('insertPage.resultPlaceholder')}</p>
                  </div>
                )}

                {resultImage && (
                  <button className="download-btn" onClick={handleDownload}>
                    {t('insertPage.downloadResult')}
                  </button>
                )}

              </div>
            </div>

            {successMessage && (
              <div className="success-message">{t('insertPage.successMessage')}</div>
            )}
          </div>

          <div className="info-table2">
            <h3>{t('insertPage.watermarkInsert')}</h3>
            <table className="watermark-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('insertPage.watermarkDescription')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {descriptions.map((desc, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        placeholder={t('insertPage.watermarkDescriptionPlaceholder')}
                        value={desc}
                        onChange={(e) => handleChange(index, e.target.value)}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleRemove(index)}>{t('insertPage.delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {descriptions.length < 10 && (
              <button onClick={handleAdd} className="add-row-btn">+</button>
            )}
            {warning && <p className="warning-text">{warning}</p>}

            <p className="text-xs text-gray-500 mt-2">
              {t('insertPage.maxWatermarkNotice')}
            </p>
          </div>
        </div>

        <div><button className="action-button" onClick={handleSubmit}>{t('insertPage.submit')}</button></div>

        {isEmbeddingWatermark && (
          <div className="loading-overlay">
            <div className="spinner" />
            <p className="loading-text">{t('insertPage.embeddingWatermark')}</p>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default InsertPage;