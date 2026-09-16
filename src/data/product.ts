export interface Product {
  id: string;
  images: string[];
  name: string;
  description: string;
  price: number;
  isHome?: boolean;
  category: 'doorlock' | 'accessory';
}

export const products: Product[] = [
  {
    id: '1',
    images: [
      '/EL-100/EL-100_on.png',
      '/EL-100/EL-100_front.png',
      '/EL-100/EL-100_side.png',
      '/EL-100/EL-100_inner.png',
      '/EL-100/EL-100_inner_side.png',
    ],
    name: 'EL-100',
    description: '세련된 디자인과 다양한 보안기능으로 더 안전하고 편리한 스마트 도어락',
    price: 10000,
    isHome: true,
    category: 'doorlock',
  },
  {
    id: '2',
    images: [
      '/EL-100B/EL-100B_on.png',
      '/EL-100B/EL-100B_front.png',
      '/EL-100B/EL-100B_inner.png',
      '/EL-100B/EL-100B_inner_side.png',
      '/EL-100B/EL-100B_IO.png',
    ],
    name: 'EL-100B',
    description: '지문인식 기능을 더해 보안성을 강화한 프리미엄 스마트 도어락',
    price: 15000,
    isHome: true,
    category: 'doorlock',
  },
  {
    id: '3-1',
    images: [
      '/ER-10N/ER-10N_Black_front.png',
      '/ER-10N/ER-10N_Black_on.png',
      '/ER-10N/ER-10N_Black_open.png',
      '/ER-10N/ER-10N_Black_open_on.png',
      '/ER-10N/ER-10N_inner.png',
      '/ER-10N/ER-10N_inner_side.png',
      '/ER-10N/ER-10N_inner_side_rot.png',
    ],
    name: 'ER-10N(B)',
    description: '컴팩트한 디자인과 간편한 사용성으로 어떤 문에도 잘 어울리는 스마트 도어락',
    price: 20000,
    category: 'doorlock',
  },
  {
    id: '3-2',
    images: [
      '/ER-10N/ER-10N_Red_on.png',
      '/ER-10N/ER-10N_Red_front.png',
      '/ER-10N/ER-10N_Red_open.png',
      '/ER-10N/ER-10N_Red_open_on.png',
      '/ER-10N/ER-10N_Red.png',
      '/ER-10N/ER-10N_inner_side.png',
      '/ER-10N/ER-10N_inner_side_rot.png',
    ],
    name: 'ER-10N(R)',
    description: '컴팩트한 디자인과 간편한 사용성으로 어떤 문에도 잘 어울리는 스마트 도어락',
    price: 20000,
    isHome: true,
    category: 'doorlock',
  },
  {
    id: '3-3',
    images: [
      '/ER-10N/ER-10N_Silver_front.png',
      '/ER-10N/ER-10N_Silver_on.png',
      '/ER-10N/ER-10N_Silver_open.png',
      '/ER-10N/ER-10N_Silver_open_on.png',
      '/ER-10N/ER-10N_inner.png',
      '/ER-10N/ER-10N_inner_side.png',
      '/ER-10N/ER-10N_inner_side_rot.png',
    ],
    name: 'ER-10N(S)',
    description: '컴팩트한 디자인과 간편한 사용성으로 어떤 문에도 잘 어울리는 스마트 도어락',
    price: 20000,
    category: 'doorlock',
  },
  {
    id: '4',
    images: ['/EP-1000/EP-1000_side.png'],
    name: 'EP-1000',
    description: '고급스러운 디자인과 강력한 보안성으로 더 편리하고 안전한 스마트 도어락',
    price: 20000,
    isHome: true,
    category: 'doorlock',
  },
];
