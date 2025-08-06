import React, { useState } from 'react';
import Layout from './Layout';
import '../../css/SignupPage.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    emailVerificationCode: '',
    password: '',
    confirmPassword: '',
    terms: {
      all: false,
      required1: false,
      required2: false,
      optional: false,
    },
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [emailVerificationError, setEmailVerificationError] = useState('');

  const [highlightRequired, setHighlightRequired] = useState(false);

  const validatePassword = (password) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*]/.test(password),
  });

  const passwordValidation = validatePassword(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('terms.')) {
      const termName = name.split('.')[1];
      const newTerms = { ...formData.terms, [termName]: checked };
      if (termName === 'all') {
        Object.keys(newTerms).forEach((key) => {
          newTerms[key] = checked;
        });
      } else {
        newTerms.all = newTerms.required1 && newTerms.required2 && newTerms.optional;
      }
      setFormData({ ...formData, terms: newTerms });
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = '아이디를 입력하세요';
    if (!formData.email.trim()) newErrors.email = '이메일을 입력하세요';
    if (!formData.password) newErrors.password = '비밀번호를 입력하세요';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    if (!formData.terms.required1 || !formData.terms.required2) newErrors.terms = '필수 약관에 동의해야 합니다';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUsernameCheck = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/ValidateUserName`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: formData.username }),
    });

    const rawText = await response.text();
    console.log("서버 응답:", rawText);
    setUsernameAvailable(response.ok);
  };

  const handleEmailCheck = async () => {
    try {
      if (!formData.email) {
        setEmailVerificationError('이메일을 입력해주세요.');
        return;
      }

      const checkResponse = await fetch(`${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/ValidateEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const checkText = await checkResponse.text();
      console.log("이메일 중복 확인 응답:", checkText);

      if (checkResponse.status === 200) {
        setEmailAvailable(true);

        const sendResponse = await fetch(`${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/PostEmail`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });

        const sendText = await sendResponse.text();
        console.log("인증 코드 전송 응답:", sendText);

        if (sendResponse.status === 200) {
          setEmailVerificationSent(true);
          setEmailVerificationError('');
        } else {
          setEmailVerificationSent(false);
          setEmailVerificationError('인증 메일 전송에 실패했습니다.');
        }
      } else if (checkResponse.status === 500) {
        setEmailAvailable(false);
        setEmailVerificationSent(false);
        setEmailVerificationError('올바른 이메일 형식을 입력해주세요.');
      } else {
        setEmailAvailable(false);
        setEmailVerificationSent(false);
        setEmailVerificationError('이메일 중복 확인에 실패했습니다.');
      }

    } catch (error) {
      console.error("이메일 확인/인증 중 오류 발생:", error);
      setEmailAvailable(false);
      setEmailVerificationSent(false);
      setEmailVerificationError('서버 오류가 발생했습니다.');
    }
  };

  const handleVerifyEmailCode = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/CheckEmailCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          emailcode: emailVerificationCode,
        }),
      });

      const rawText = await response.text();
      console.log("이메일 코드 인증 응답:", rawText);

      if (response.ok) {
        setEmailVerified(true);
        setEmailVerificationError('');
      } else {
        setEmailVerified(false);
        setEmailVerificationError('인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error("인증 코드 확인 중 오류:", error);
      setEmailVerificationError('서버 오류가 발생했습니다.');
    }
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.terms.required1 || !formData.terms.required2) {
      setErrors({ ...errors, terms: "필수 약관에 동의해주세요." });
      setHighlightRequired(true);
      setTimeout(() => setHighlightRequired(false), 1000);
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/4768b05aa6df12a2ddad4c3a58ad2da2/SignUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        navigate('/login')
      } else {
        const text = await response.text();
        console.error("서버 응답:", text);
        setErrors(prev => ({ ...prev, server: "회원가입 실패: " + response.status }));
      }

    } catch (error) {
      console.error("회원가입 오류:", error);
      setErrors(prev => ({ ...prev, server: "서버와 연결할 수 없습니다." }));
    }
  };

  return (
    <Layout>
      <div className="signup-container">
        <div className="signup-card">
          <h2>회원가입</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">아이디</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="아이디를 입력하세요"
                />
                <button type="button" onClick={handleUsernameCheck}>중복확인</button>
              </div>
              {usernameAvailable === true && <p className="true-message">사용가능한 아이디입니다.</p>}
              {usernameAvailable === false && <p className="error-message">중복된 아이디입니다.</p>}
              {errors.username && <p className="error-message">{errors.username}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="email">이메일</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={emailVerified}
                  style={{ color: emailVerified ? '#999' : '#000' }}
                />
                <button type="button" onClick={handleEmailCheck} disabled={emailVerified}>이메일 중복 확인</button>
              </div>
              {emailAvailable === true && <p className="true-message">사용 가능한 이메일입니다.</p>}
              {emailAvailable === false && !emailVerificationError && <p className="error-message">이미 등록된 이메일입니다.</p>}
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            {emailVerificationSent && (
              <>
                <div className="verification-code-group">
                  <input
                    type="text"
                    id="emailVerificationCode"
                    className="emailVerificationCode"
                    placeholder=" 인증 코드를 입력하세요"
                    value={emailVerificationCode}
                    onChange={(e) => setEmailVerificationCode(e.target.value)}
                    disabled={emailVerified}
                    style={{ color: emailVerified ? '#999' : '#000' }}
                  />
                  <button type="button" onClick={handleVerifyEmailCode} disabled={emailVerified}>확인</button>
                </div>
                {emailVerified ? (
                  <p className="info-message">✅ 인증이 완료되었습니다.</p>
                ) : (
                  <p className="info-message">📧 인증 코드가 이메일로 전송되었습니다.</p>
                )}
                {emailVerificationError && <p className="error-message">{emailVerificationError}</p>}
              </>
            )}

            <div className="input-group">
              <label htmlFor="password">비밀번호</label>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            <div className="password-requirements">
              <p className='password-requirements'>비밀번호 요구사항:</p>
              <ul>
                <li className={passwordValidation.length ? 'valid' : 'invalid'}>
                  <span className="checkmark">{passwordValidation.length ? '✓' : '✗'}</span>8자 이상
                </li>
                <li className={passwordValidation.uppercase ? 'valid' : 'invalid'}>
                  <span className="checkmark">{passwordValidation.uppercase ? '✓' : '✗'}</span>대문자 포함
                </li>
                <li className={passwordValidation.lowercase ? 'valid' : 'invalid'}>
                  <span className="checkmark">{passwordValidation.lowercase ? '✓' : '✗'}</span>소문자 포함
                </li>
                <li className={passwordValidation.number ? 'valid' : 'invalid'}>
                  <span className="checkmark">{passwordValidation.number ? '✓' : '✗'}</span>숫자 포함
                </li>
                <li className={passwordValidation.specialChar ? 'valid' : 'invalid'}>
                  <span className="checkmark">{passwordValidation.specialChar ? '✓' : '✗'}</span>특수문자 포함
                </li>
              </ul>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <div className="password-field">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? '🙈' : '👁️'}
                </span>
              </div>
              {formData.confirmPassword && (
                <p className={`match-message ${formData.password === formData.confirmPassword ? 'match'
                  : 'mismatch'}`}>
                  {formData.password === formData.confirmPassword ? '비밀번호가 일치합니다 ✅' : '비밀번호가 일치하지 않습니다 ❌'}
                </p>
              )}
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>

            <div className={`checkbox-group ${highlightRequired ? 'shake-highlight' : ''}`}>
              <div className="checkbox-item">
                <input type="checkbox" id="selectAll" name="terms.all" checked={formData.terms.all} onChange={handleChange} />
                <label htmlFor="selectAll" className="select-all">모두 동의합니다</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="required1" name="terms.required1" checked={formData.terms.required1} onChange={handleChange} />
                <label htmlFor="required1">[필수] 이용약관 동의</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="required2" name="terms.required2" checked={formData.terms.required2} onChange={handleChange} />
                <label htmlFor="required2">[필수] 개인정보 수집 및 이용 동의</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="optional" name="terms.optional" checked={formData.terms.optional} onChange={handleChange} />
                <label htmlFor="optional">[선택] 마케팅 정보 수신 동의
                  <span className="tooltip">ℹ️<span className="tooltip-text">신상품, 이벤트 등 정보를 받을 수 있어요.</span></span>
                </label>
              </div>
              {errors.terms && <p className="error-message">{errors.terms}</p>}
            </div>

            <button type="submit" className="signup-button">회원가입</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;