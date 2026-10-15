// 기능의 이름, 설명, 아이콘은 DB(feature_catalog)에서 읽습니다.
// 아래 FEATURE_INFO 는 DB를 읽지 못하거나 카탈로그에 행이 없을 때 쓰는 대체값입니다.

import type { AccessMethodCode, FeatureCode, ProductView } from './types';

export const ACCESS_METHOD_LABELS: Record<AccessMethodCode, string> = {
  PASSWORD: '비밀번호',
  CARD_KEY: '카드키',
  FINGERPRINT: '지문',
};

export const FEATURE_INFO: Record<FeatureCode, { name: string; description: string }> = {
  HIGH_TEMP_ALARM: {
    name: '고온경보',
    description: '화재 감지 시 경보 후 자동 열림',
  },
  FAKE_PIN: {
    name: '허수기능',
    description: '임의 번호로 비밀번호 노출 방지',
  },
  OPEN_CLOSE_INDICATOR: {
    name: '열림/닫힘 표시',
    description: '실내에서 잠금 상태 확인',
  },
  STATUS_LED: {
    name: '상태 표시 (LED)',
    description: 'LED로 작동 상태 안내',
  },
  AUTO_LOCK: {
    name: '바로잠김',
    description: '문이 닫히면 자동 잠금',
  },
  TAMPER_PROTECTION: {
    name: '장난방지',
    description: '실내 버튼 오작동 방지',
  },
  NO_DRILL_INSTALLATION: {
    name: '무타공 설치',
    description: '추가 타공 없이 간편 설치',
  },
};

export function formatPrice(product: Pick<ProductView, 'price' | 'priceDisplayStatus'>) {
  if (product.priceDisplayStatus === 'DISPLAY' && product.price !== null) {
    return `${product.price.toLocaleString()}원`;
  }
  if (product.priceDisplayStatus === 'TBD') return '가격 미정';
  return null;
}
