/**
 * Simple, robust client-side file reading and text extraction for PDF and DOCX/text.
 */

export async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt' || extension === 'md') {
    return file.text();
  }

  // If PDF file, read text streams or strings
  if (extension === 'pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binaryStr = '';
      // Read chunks safely without stack overflow
      const chunkSize = 8192;
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        binaryStr += String.fromCharCode(...uint8Array.subarray(i, i + chunkSize));
      }

      // Extract text within stream blocks or parentheses/brackets
      const textMatches: string[] = [];

      // Look for standard PDF text strings: (Text here) Tj or [(T) (ext)] TJ
      const tjRegex = /\(([^)]+)\)\s*Tj/g;
      let match: RegExpExecArray | null;
      while ((match = tjRegex.exec(binaryStr)) !== null) {
        if (match[1] && match[1].trim().length > 1) {
          textMatches.push(match[1].replace(/\\([()\\])/g, '$1'));
        }
      }

      // If Tj found text, join it
      if (textMatches.length > 20) {
        return textMatches.join(' ');
      }

      // Fallback: extract printable ASCII strings with length >= 3
      const asciiStrings = binaryStr.match(/[A-Za-z0-9,.:;'"!@#$%&*()_+=\-/ ]{4,}/g) || [];
      const cleanAscii = asciiStrings
        .filter((s) => !/^[0-9a-f]{8,}$/i.test(s) && !s.startsWith('/'))
        .slice(0, 500)
        .join(' ');

      if (cleanAscii.length > 100) {
        return cleanAscii;
      }
    } catch (e) {
      console.warn('Could not extract PDF text locally:', e);
    }
  }

  // If DOCX or other binary
  try {
    const text = await file.text();
    // Filter printable text if xml/plain text is present
    const xmlTextMatches = text.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    if (xmlTextMatches && xmlTextMatches.length > 0) {
      return xmlTextMatches.map((m) => m.replace(/<[^>]+>/g, '')).join(' ');
    }
  } catch (e) {
    console.warn('DOCX plain read error:', e);
  }

  return '';
}
