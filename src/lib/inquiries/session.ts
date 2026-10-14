import 'server-only';

import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

import { loadInquiryDetail } from './access';
import type { InquiryDetail } from './types';

const SESSION_SECONDS = 30 * 60;

// 본인 확인에 성공하면 "이 문의를 볼 수 있음"을 서명해서 쿠키에 담는다.
// 문의 한 건마다 쿠키가 따로이고, 그 문의의 상세 경로에서만 전송된다. 다른 문의는 열리지 않는다.
const cookieName = (id: string) => `inquiry-access-${id}`;
const cookiePath = (id: string) => `/inquiry-list/${id}`;

function getKey() {
  const secret = process.env.INQUIRY_LOOKUP_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('INQUIRY_LOOKUP_SECRET 환경변수가 없거나 32자보다 짧습니다.');
  }
  return new TextEncoder().encode(secret);
}

export async function grantInquiryAccess(id: string) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(getKey());

  const cookieStore = await cookies();
  cookieStore.set(cookieName(id), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: cookiePath(id),
    maxAge: SESSION_SECONDS,
  });
}

async function hasInquiryAccess(id: string) {
  const token = (await cookies()).get(cookieName(id))?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ['HS256'] });
    return payload.sub === id;
  } catch {
    return false;
  }
}

/**
 * 상세 페이지(`/inquiry-list/[id]`)에서 부르는 함수.
 * 본인 확인 쿠키가 없거나 만료됐으면 null을 돌려주므로, 호출한 쪽에서 `/inquiry-list`로 보내면 된다.
 */
export async function getVerifiedInquiryDetail(id: string): Promise<InquiryDetail | null> {
  if (!(await hasInquiryAccess(id))) return null;
  return loadInquiryDetail(id);
}
