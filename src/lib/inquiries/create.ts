import 'server-only';

import bcrypt from 'bcryptjs';
import { fileTypeFromBuffer } from 'file-type';

import { supabaseAdmin } from '@/lib/supabase/admin';

import {
  INQUIRY_FILE_MAX_SIZE,
  INQUIRY_FILE_MIME_TYPES,
  INQUIRY_TYPE_MAP,
  type CreatedInquiry,
  type InquiryInput,
} from './schema';

const BUCKET = 'inquiry-attachments';
const BCRYPT_COST = 10;

const EXTENSION: Record<(typeof INQUIRY_FILE_MIME_TYPES)[number], string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

export class InquiryError extends Error {}

/** 브라우저가 보낸 MIME 값은 믿지 않고, 파일 앞부분(매직 바이트)으로 실제 형식을 판별한다. */
async function inspectFile(file: File) {
  if (file.size === 0) throw new InquiryError('빈 파일은 첨부할 수 없습니다.');
  if (file.size > INQUIRY_FILE_MAX_SIZE)
    throw new InquiryError('첨부파일은 10MB 이하만 가능합니다.');

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detected = await fileTypeFromBuffer(bytes);
  const mime = detected?.mime as (typeof INQUIRY_FILE_MIME_TYPES)[number] | undefined;
  if (!mime || !INQUIRY_FILE_MIME_TYPES.includes(mime)) {
    throw new InquiryError('사진(JPG, PNG, WEBP) 또는 PDF만 첨부할 수 있습니다.');
  }
  return { bytes, mime };
}

export async function createInquiry(
  input: InquiryInput,
  file: File | null
): Promise<{ id: string; inquiry: CreatedInquiry }> {
  const attachment = file ? await inspectFile(file) : null;

  const id = crypto.randomUUID();
  const email = input.email.trim();
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST);

  let storagePath: string | null = null;
  if (file && attachment) {
    // 원본 파일명은 경로에 쓰지 않는다. (경로 조작·한글 파일명 문제 방지)
    storagePath = `${id}/${crypto.randomUUID()}.${EXTENSION[attachment.mime]}`;
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, attachment.bytes, { contentType: attachment.mime, upsert: false });
    if (error) throw new Error(`첨부파일 업로드 실패: ${error.message}`);
  }

  const removeUploaded = async () => {
    if (storagePath) await supabaseAdmin.storage.from(BUCKET).remove([storagePath]);
  };

  const { data, error } = await supabaseAdmin
    .from('inquiries')
    .insert({
      id,
      inquiry_type: INQUIRY_TYPE_MAP[input.type],
      title: input.title,
      customer_name: input.name,
      email,
      product_name_text: input.productName || null,
      content: input.content,
      password_hash: passwordHash,
      privacy_consent_at: new Date().toISOString(),
    })
    .select('inquiry_no, created_at')
    .single();

  if (error || !data) {
    await removeUploaded();
    throw new Error(`문의 저장 실패: ${error?.message ?? 'no data'}`);
  }

  if (file && attachment && storagePath) {
    const { error: attachError } = await supabaseAdmin.from('inquiry_attachments').insert({
      inquiry_id: id,
      storage_bucket: BUCKET,
      storage_path: storagePath,
      original_name: file.name.slice(0, 255),
      mime_type: attachment.mime,
      file_size: file.size,
    });
    if (attachError) {
      // 첨부 정보가 없는 문의가 남지 않도록 방금 만든 문의와 파일을 함께 지운다.
      await supabaseAdmin.from('inquiries').delete().eq('id', id);
      await removeUploaded();
      throw new Error(`첨부 정보 저장 실패: ${attachError.message}`);
    }
  }

  // id는 서버에서 메일을 보낼 때만 쓰고, 브라우저로 넘기는 CreatedInquiry에는 넣지 않는다.
  return {
    id,
    inquiry: {
      inquiryNo: data.inquiry_no,
      inquiryType: input.type,
      email,
      createdAt: data.created_at,
    },
  };
}
