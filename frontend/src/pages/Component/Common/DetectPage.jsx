import { useState } from 'react';
import Layout from './Layout';
import '../../css/DetectPage.css';

const DetectPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [finalImage, setFinalImage] = useState('');
  const [dragging, setDragging] = useState(false);

  const supportedFormats = ['image/png', 'image/jpeg', 'image/jpg'];
  const maxFileSize = 30 * 1024 * 1024; // 30MB

  const handleFileChange = (file) => {
    if (!file) return;

    if (!supportedFormats.includes(file.type)) {
      alert('지원되지 않는 파일 형식입니다. PNG, JPG, JPEG만 지원됩니다.');
      return;
    }

    if (file.size > maxFileSize) {
      alert('파일 크기가 30MB를 초과합니다.');
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setFinalImage(''); // 초기화
  };

  const onFileInputChange = (event) => {
    const file = event.target.files[0];
    handleFileChange(file);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => {
    setDragging(false);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    handleFileChange(file);
  };

  const showFinalImage = () => {
    if (!previewImage) {
      alert('이미지를 먼저 업로드하세요.');
      return;
    }
    setFinalImage(previewImage);
  };

  return (
    <Layout>
      <div className="Fakescan_container">
        <div className="Fakescan_center_side">
          <h2>이미지 보기</h2>

          <div className="file-support-info">
            <p>✅ 지원 파일 형식: PNG, JPG, JPEG</p>
            <p>📏 최대 파일 크기: 30MB</p>
          </div>

          <div
            className={`file-drop-zone ${dragging ? 'dragging' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="drop-zone-preview"
              />
            ) : (
              <p>이미지를 드래그 & 드롭하거나 클릭하여 업로드하세요.</p>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={onFileInputChange}
              style={{ display: 'none' }}
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="file-upload-button">
              이미지 선택
            </label>
          </div>

          {selectedFile && (
            <div className="file-info">
              <p>파일명: {selectedFile.name}</p>
              <p>크기: {(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          )}

          <button
            className="action-button"
            onClick={showFinalImage}
            style={{ marginTop: '20px' }}
          >
            검출하기
          </button>

          {finalImage && (
            <div className="file-preview-container">
              <h3>업로드된 이미지:</h3>
              <img src={finalImage} alt="Final" className="file-preview" />

              {/* ✅ 다운로드 버튼 */}
              <a
                href={finalImage}
                download="검출된_이미지.png"
                className="download-button"
                style={{
                  marginTop: '10px',
                  display: 'inline-block',
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                이미지 다운로드
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DetectPage;