import { AccessMethodCode, FeatureCode, ProductCategory } from '../products/types';

export type AdminProduct = {
  id: string;
  name: string;
  model_name: string;
  category: 'DOOR_LOCK' | 'ACCESSORY';
  visibility: 'PUBLIC' | 'PRIVATE';
  price_amount: number | null;
  price_display_status: 'DISPLAY' | 'TBD' | 'HIDDEN';
  sort_order: number;
  updated_at: string;
  thumbnail_url: string | null;
};

export type AdminProductRow = Omit<AdminProduct, 'thumbnail_url'> & {
  product_images: {
    display_order: number;
    is_primary: boolean;
    product_image_variants: { color_id: string | null; storage_path: string }[];
  }[];
};

export type ExistingProductImage = { kind: 'existing'; id: string; url: string };
export type NewProductImage = { kind: 'new'; id: string; file: File; previewUrl: string };
export type ProductImage = ExistingProductImage | NewProductImage;

export type ExistingProductManual = { kind: 'existing'; url: string; fileName: string };
export type ProductManual = ExistingProductManual | { kind: 'new'; file: File } | null;

export interface ProductFormValues {
  category: ProductCategory | '';
  visibility: 'PUBLIC' | 'PRIVATE' | '';
  modelName: string;
  name: string;
  price: string;
  sortOrder: string;
  images: ProductImage[];
  summary: string;
  description: string;
  color: string;
  accessMethods: AccessMethodCode[];
  features: FeatureCode[];
  manual: ProductManual;
}

export type ProductDraft = Omit<ProductFormValues, 'images' | 'manual'> & {
  images: ExistingProductImage[];
  manual: ExistingProductManual | null;
  savedAt: string;
};

export type AdminProductDetail = {
  id: string;
  category: ProductCategory;
  visibility: 'PUBLIC' | 'PRIVATE';
  model_name: string;
  name: string;
  price_amount: number | null;
  sort_order: number;
  summary: string;
  color: string;
  description: string;
  access_methods: AccessMethodCode[];
  features: FeatureCode[];
  images: { id: string; url: string }[];
  manual: { url: string; file_name: string } | null;
};
