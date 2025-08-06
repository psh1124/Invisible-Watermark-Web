import { useState, useEffect } from 'react';
import Layout from './Layout';
import '../../css/Api.css';
import { useTranslation } from 'react-i18next';

const Api = () => {
  const { t } = useTranslation();
  const [apiKeys, setApiKeys] = useState([]);

  useEffect(() => {
    // 서버 연동 코드 (주석 처리됨)
    /*
    fetch(`${import.meta.env.VITE_API_BASE}/user/apiKeys`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setApiKeys(data.keys))
      .catch(err => console.error(err));
    */

    // 임시: 랜덤 키 3개 생성
    const tempKeys = Array.from({ length: 3 }, () =>
      Math.random().toString(36).substring(2, 15)
    ).map((key) => ({
      key,
      createdAt: new Date().toISOString(),
    }));

    setApiKeys(tempKeys);
  }, []);

  const handleAddApiKey = () => {
    /*
    fetch(`${import.meta.env.VITE_API_BASE}/user/apiKeys`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setApiKeys(prev => [...prev, data.newKey]))
      .catch(err => console.error(err));
    */

    const newKey = Math.random().toString(36).substring(2, 15);
    const newEntry = {
      key: newKey,
      createdAt: new Date().toISOString(),
    };
    setApiKeys((prev) => [...prev, newEntry]);
  };

  const handleDeleteApiKey = (keyToDelete) => {
    /*
    fetch(`${import.meta.env.VITE_API_BASE}/user/apiKeys/${keyToDelete}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(res => {
        if(res.ok) {
          setApiKeys(prev => prev.filter(item => item.key !== keyToDelete));
        }
      })
      .catch(err => console.error(err));
    */

    setApiKeys((prev) => prev.filter((item) => item.key !== keyToDelete));
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth()+1).toString().padStart(2,'0');
    const day = date.getDate().toString().padStart(2,'0');
    const hour = date.getHours().toString().padStart(2,'0');
    const min = date.getMinutes().toString().padStart(2,'0');
    return `${year}-${month}-${day} ${hour}:${min}`;
  };

  return (
    <Layout>
      <div className="api">
        <h2>{t('api.title')}</h2>
        <div className="api-key-list">
          {apiKeys.map(({ key, createdAt }) => (
            <div key={key} className="api-key-card">
              <div>
                <code>{key}</code>
                <span className="api-key-created">
                  {t('api.createdAt')}: {formatDateTime(createdAt)}
                </span>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDeleteApiKey(key)}
                aria-label={t('api.deleteAriaLabel', { key })}
              >
                {t('api.delete')}
              </button>
            </div>
          ))}
          {apiKeys.length === 0 && <p>{t('api.noKeys')}</p>}
        </div>
        <button className="add-api-key-btn" onClick={handleAddApiKey}>
          + {t('api.addKey')}
        </button>
      </div>
    </Layout>
  );
};

export default Api;