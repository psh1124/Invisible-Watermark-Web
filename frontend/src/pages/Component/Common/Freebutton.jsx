import { useState } from 'react';
import Layout from './Layout'; // Adjust path as needed
import QRCode from 'qrcode';
import '../../css/Freebutton.css'; // Adjust CSS path as needed

const Fakescane = () => {
  const [files, setFiles] = useState([]);
  const [watermarkText, setWatermarkText] = useState('');
  const [insertQrCodeUrl, setInsertQrCodeUrl] = useState(''); // 삽입된 QR
  const [detectQrCodeUrl, setDetectQrCodeUrl] = useState(''); // 검출된 QR

  const handleFileChange = (event) => {
    setFiles([...files, ...event.target.files]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles([...files, ...event.dataTransfer.files]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileDelete = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const generateQRCode = async (text) => {
    try {
      return await QRCode.toDataURL(text);
    } catch (error) {
      console.error('QR 코드 생성 오류:', error);
      return '';
    }
  };

  const insertWatermark = async () => {
    if (!watermarkText.trim()) {
      alert('워터마크 정보를 입력하세요!');
      return;
    }
    const qrCodeData = await generateQRCode(watermarkText);
    setInsertQrCodeUrl(qrCodeData);
    alert('비가시성 워터마크 삽입 완료!');
  };

  const detectWatermark = () => {
    if (!insertQrCodeUrl) {
      alert('검출할 QR 코드가 없습니다!');
      return;
    }
    setDetectQrCodeUrl(insertQrCodeUrl); // 삽입된 QR을 검출 QR로 표시
    alert('비가시성 워터마크 검출 완료!');
  };

  return (
    <Layout>
      <div className="Fakescan_container">
        <div className="Fakescan_left_side">left</div>
        <div className="Fakescan_center_side">
          <div className="Fakescan_center_side_top">
            <h2>파일을 업로드하여 워터마크를 추가하세요</h2>
          </div>

          <div
            className="Fakescan_center_side_center file-drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <h3>여기에 파일을 드래그 앤 드롭하세요</h3>
          </div>

          <div className="input-container">
            <label>추가할 워터마크 정보:</label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="워터마크 정보를 입력하세요"
            />
          </div>

          <div className="file-select-button-container">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="file-upload-button">
              파일 선택
            </label>
          </div>

          <div className="file-preview-container">
            {files.length > 0 && (
              <div className="file-list">
                {files.map((file, index) => (
                  <div className="file-item" key={index}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="file-preview"
                    />
                    <span>{file.name}</span>
                    <button onClick={() => handleFileDelete(index)}>
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button className="action-button" onClick={insertWatermark}>
              비가시성 워터마크 삽입
            </button>
            <button className="action-button" onClick={detectWatermark}>
              비가시성 워터마크 검출
            </button>
          </div>

          {/* 삽입된 QR 코드 */}
          {insertQrCodeUrl && (
            <div className="qr-code-container">
              <h3>삽입된 QR 코드:</h3>
              <img src={insertQrCodeUrl} alt="Inserted QR Code" />
            </div>
          )}

          {/* 검출된 QR 코드 */}
          {detectQrCodeUrl && (
            <div className="qr-code-container detected">
              <h3>검출된 QR 코드:</h3>
              <img src={detectQrCodeUrl} alt="Detected QR Code" />
            </div>
          )}
        </div>
        <div className="Fakescan_right_side">right</div>
      </div>
    </Layout>
  );
};

export default Fakescane;