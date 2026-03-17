import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const parser = new PDFParse(new Uint8Array(buffer));
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.trim();

    if (text.length < 50) {
      throw new Error('Could not extract meaningful text from DOCX');
    }

    return text;
  } catch (error) {
    throw new Error(`Failed to parse DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function extractText(file: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    return extractTextFromPDF(file);
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return extractTextFromDOCX(file);
  } else if (mimeType === 'text/plain') {
    return file.toString('utf-8');
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}

export function validateFile(file: { size: number; type: string }): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
  ];

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File too large. Maximum size is 10MB.' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Unsupported file type. Please upload PDF, DOCX, or TXT.' };
  }

  return { valid: true };
}
