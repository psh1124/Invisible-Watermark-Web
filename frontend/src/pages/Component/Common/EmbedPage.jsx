import { useState } from 'react';
import Layout from './Layout';
import '../../css/EmbedPage.css';

const InsertPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [isInserted, setIsInserted] = useState(false); // 삽입 여부 상태

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
    setFileInfo({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
    });
    setIsInserted(false); // 새 파일 선택 시 삽입 초기화
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

  const handleInsert = () => {
    if (!previewImage) {
      alert('이미지를 먼저 업로드하세요.');
      return;
    }
    setIsInserted(true);
  };

  const downloadImage = () => {
    if (!previewImage) {
      alert('다운로드할 이미지가 없습니다.');
      return;
    }
    const link = document.createElement('a');
    link.href = previewImage;
    link.download = selectedFile?.name || 'uploaded_image.png';
    link.click();
  };

  return (
    <Layout>
      <div className="Fakescan_container">
        <div className="Fakescan_center_side">
          <h2>이미지 업로드</h2>

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
              id="fileUpload"
              hidden
            />
            <label htmlFor="fileUpload" className="file-upload-button">
              이미지 선택
            </label>
          </div>

          {selectedFile && (
            <div className="file-info">
              <p>파일명: {fileInfo?.name}</p>
              <p>크기: {fileInfo?.size}</p>
            </div>
          )}

          <button
            className="action-button"
            onClick={handleInsert}
            style={{ marginTop: '20px' }}
          >
            삽입하기
          </button>

          {isInserted && previewImage && (
            <div className="file-preview-container">
              <h3>삽입된 이미지 미리보기:</h3>
              <img src={previewImage} alt="Uploaded" className="file-preview" />
              <button className="download-button" onClick={downloadImage}>
                이미지 다운로드
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InsertPage;