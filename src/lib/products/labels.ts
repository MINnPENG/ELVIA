// 화면에 보이는 이름과 아이콘은 코드로 정하고 DB에는 저장하지 않습니다.

import type { AccessMethodCode, FeatureCode, ProductView } from './types';

export const ACCESS_METHOD_LABELS: Record<AccessMethodCode, string> = {
  PASSWORD: '비밀번호',
  CARD_KEY: '카드키',
  FINGERPRINT: '지문',
};

export const FEATURE_INFO: Record<
  FeatureCode,
  { name: string; description: string; icon: string | null }
> = {
  HIGH_TEMP_ALARM: {
    name: '고온경보',
    description: '화재 감지 시 경보 후 자동 열림',
    icon: null,
  },
  FAKE_PIN: {
    name: '허수기능',
    description: '임의 번호로 비밀번호 노출 방지',
    icon: '/icons/feature-anti_peep.png',
  },
  OPEN_CLOSE_INDICATOR: {
    name: '열림/닫힘 표시',
    description: '실내에서 잠금 상태 확인',
    icon: null,
  },
  STATUS_LED: {
    name: '상태 표시 (LED)',
    description: 'LED로 작동 상태 안내',
    icon: '/icons/feature-status_LED.png',
  },
  AUTO_LOCK: {
    name: '바로잠김',
    description: '문이 닫히면 자동 잠금',
    icon: '/icons/feature-autolock.png',
  },
  TAMPER_PROTECTION: {
    name: '장난방지',
    description: '실내 버튼 오작동 방지',
    icon: null,
  },
  NO_DRILL_INSTALLATION: {
    name: '무타공 설치',
    description: '추가 타공 없이 간편 설치',
    icon: '/icons/feature-no_drilling.png',
  },
};

export function formatPrice(product: Pick<ProductView, 'price' | 'priceDisplayStatus'>) {
  if (product.priceDisplayStatus === 'DISPLAY' && product.price !== null) {
    return `${product.price.toLocaleString()}원`;
  }
  if (product.priceDisplayStatus === 'TBD') return '가격 미정';
  return null;
}
