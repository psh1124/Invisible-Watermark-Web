# Invisible Watermark Web

웹 기반 **비가시성(보이지 않는) 워터마크 삽입 및 검출 서비스**의 프론트엔드 프로젝트입니다.  
사용자는 이미지를 업로드하여 워터마크를 삽입하거나, 워터마크가 포함된 이미지를 검출할 수 있습니다.

> ⚠️ 본 저장소는 **프론트엔드 구현을 중심으로 관리**되고있고 워터마크 처리 로직 및 서버는 **외부 백엔드 API**를 사용하고 있습니다.

---

## 📌 프로젝트 개요

- 이미지 저작권 보호를 위한 **비가시성 워터마크 웹 서비스**
- 사용자 친화적인 UI를 통해 워터마크 삽입·검출 기능 제공
- 프론트엔드와 백엔드가 분리된 구조 (API 기반 통신)

---

## ✨ 주요 기능

- 이미지 업로드 및 미리보기
- 비가시성 워터마크 삽입 요청
- 워터마크 검출 요청
- 처리 결과 이미지 및 상태 표시
- 반응형 UI 구성

---

## 🧑‍💻 담당 역할

- **프론트엔드 전체 구현**
  - 화면 UI/UX 설계
  - 이미지 업로드 및 결과 표시
  - 백엔드 API 연동
- **백엔드**
  - 워터마크 삽입·검출 알고리즘 및 서버 로직은 **외부에서 관리**
  - 본 저장소에서는 백엔드 내부 구현을 다루지 않음

---

## 🗂️ 프로젝트 구조

```bash
Invisible-Watermark-Web/
├── frontend/ # 프론트엔드 소스 코드
├── node_modules/ # Node.js 패키지
├── index.py # 백엔드 서버 실행 파일 (참고용)
├── package.json # 프로젝트 의존성 및 스크립트
├── package-lock.json # 의존성 버전 고정
└── .vscode/ # 개발 환경 설정
```

---

## 🛠️ 기술 스택

### Frontend
- HTML / CSS / JavaScript
- React (또는 Vite 기반 SPA 구조)
- Fetch / Axios 기반 API 통신

### Backend
- Python 기반 서버
- **외부 API 사용 (본 프로젝트에서 관리하지 않음)**

---

## 🚀 실행 방법 (Frontend)

```bash
# 저장소 클론
git clone https://github.com/psh1124/Invisible-Watermark-Web.git

# 프론트엔드 디렉토리 이동
cd Invisible-Watermark-Web/frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

## 🔗 API 연동 방식

- 프론트엔드는 이미지 파일을 FormData 형태로 백엔드 API에 전송
- API 응답 결과를 기반으로 처리 상태 및 결과 이미지 출력
- API URL 및 엔드포인트는 환경에 따라 설정

---

## 🔧 한계 및 개선 방향

- 현재는 이미지 파일만 지원하며, 향후 영상 파일 확장 고려
- 워터마크 강도 및 옵션을 사용자 설정으로 확장 예정
- 모바일 환경에 최적화된 UI 개선 필요

---

## 📎 참고 사항

본 프로젝트는 학습 및 포트폴리오 목적으로 제작되었습니다.

백엔드 로직 및 알고리즘에 대한 상세 내용은 포함하고 있지 않습니다.

---

📄 License

This project is licensed for educational and portfolio purposes.

---
