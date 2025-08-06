import { useState } from 'react';
import Layout from './Layout';
import '../../css/Plan.css';
import { useTranslation } from 'react-i18next';

const exchangeRates = {
  KRW: 1,
  USD: 1300,
};

const plans = [
  {
    name: 'free',
    priceKRW: 0,
    featuresKey: 'plan.features.free',
  },
  {
    name: 'standard',
    priceKRW: 9900,
    featuresKey: 'plan.features.standard',
  },
  {
    name: 'premium',
    priceKRW: 29900,
    featuresKey: 'plan.features.premium',
  },
];

const formatPrice = (krw, lang) => {
  if (lang === 'en') {
    const usd = krw / exchangeRates.USD;
    return `$${usd.toFixed(2)} / month`;
  } else {
    return `${krw.toLocaleString('ko-KR')}원 / 월`;
  }
};

const Plan = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSelectPlan = async (planName) => {
    setIsLoading(true);
    setMessage('');
    setSelectedPlan(planName);

    try {
      // 서버 연동 대신 임시 지연
      await new Promise((r) => setTimeout(r, 1000));
      setMessage(t('plan.paymentSuccess', { planName: t(`plan.planNames.${planName}`) }));
    } catch (error) {
      setMessage(t('plan.paymentFailed') + `: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="plan-container">
        <h2 className="plan-title">{t('plan.title')}</h2>
        <div className="plan-cards">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`plan-card ${selectedPlan === plan.name ? 'selected' : ''}`}
            >
              <h3 className="plan-name">{t(`plan.planNames.${plan.name}`)}</h3>
              <p className="plan-price">{formatPrice(plan.priceKRW, lang)}</p>
              <ul className="plan-features">
                {t(plan.featuresKey, { returnObjects: true }).map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button
                className="plan-select-btn"
                onClick={() => !isLoading && handleSelectPlan(plan.name)}
                disabled={isLoading && selectedPlan === plan.name}
              >
                {isLoading && selectedPlan === plan.name
                  ? t('plan.processing')
                  : t('plan.select')}
              </button>
            </div>
          ))}
        </div>
        {message && <div className="plan-message">{message}</div>}
      </div>
    </Layout>
  );
};

export default Plan;