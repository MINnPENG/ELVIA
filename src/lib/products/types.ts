export type ProductCategory = 'DOOR_LOCK' | 'ACCESSORY';
export type PriceDisplayStatus = 'DISPLAY' | 'TBD' | 'HIDDEN';
export type AccessMethodCode = 'CARD_KEY' | 'PASSWORD' | 'FINGERPRINT';
export type FeatureCode =
  | 'HIGH_TEMP_ALARM'
  | 'FAKE_PIN'
  | 'OPEN_CLOSE_INDICATOR'
  | 'STATUS_LED'
  | 'AUTO_LOCK'
  | 'TAMPER_PROTECTION'
  | 'NO_DRILL_INSTALLATION';

export type AccessMethodView = { code: AccessMethodCode; name: string };
export type FeatureView = {
  code: FeatureCode;
  name: string;
  description: string;
  icon: string | null;
};
export type ColorView = { id: string; name: string; code: string | null; isDefault: boolean };
export type ImageVariantView = { colorId: string | null; url: string };
export type ImageView = {
  id: string;
  order: number;
  isPrimary: boolean;
  variants: ImageVariantView[];
};

export type ProductView = {
  id: string;
  modelName: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  price: number | null;
  priceDisplayStatus: PriceDisplayStatus;
  colors: ColorView[];
  images: ImageView[];
  thumbnailUrl: string | null;
  accessMethods: AccessMethodView[];
  features: FeatureView[];
  manual: { url: string; name: string } | null;
};
