import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

async function extractPdfText(pdfBytes: Uint8Array): Promise<string> {
  console.log("Extracting text from PDF using pdfjs-serverless...");
  
  // Import pdfjs-serverless and resolve the PDF.js module
  const { resolvePDFJS } = await import('https://esm.sh/pdfjs-serverless@0.6.0');
  const pdfjs = await resolvePDFJS();
  
  const doc = await pdfjs.getDocument(pdfBytes).promise;
  let fullText = '';
  
  console.log(`PDF has ${doc.numPages} pages`);
  
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    // deno-lint-ignore no-explicit-any
    const pageText = textContent.items
      .filter((item: any) => typeof item.str === 'string')
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  console.log(`Extracted ${fullText.length} characters from PDF`);
  return fullText.trim();
}

async function extractDocxText(docxBytes: ArrayBuffer): Promise<string> {
  console.log("Extracting text from DOCX...");
  
  const mammoth = await import('https://esm.sh/mammoth@1.6.0');
  
  const result = await mammoth.extractRawText({
    arrayBuffer: docxBytes
  });
  
  console.log(`Extracted ${result.value.length} characters from DOCX`);
  return result.value.trim();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Received file extraction request");
    
    const contentType = req.headers.get('content-type') || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return new Response(
        JSON.stringify({ error: 'Expected multipart/form-data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`);

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size is 10MB.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine file type
    const fileName = file.name.toLowerCase();
    const isPdf = fileName.endsWith('.pdf') || file.type === 'application/pdf';
    const isDocx = fileName.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const isDoc = fileName.endsWith('.doc') || file.type === 'application/msword';

    if (!isPdf && !isDocx && !isDoc) {
      return new Response(
        JSON.stringify({ error: 'Unsupported file format. Please upload PDF, DOC, or DOCX files.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    let extractedText = '';

    if (isPdf) {
      const uint8Array = new Uint8Array(arrayBuffer);
      extractedText = await extractPdfText(uint8Array);
    } else if (isDocx) {
      extractedText = await extractDocxText(arrayBuffer);
    } else if (isDoc) {
      // DOC files are harder to parse - try treating as DOCX first
      try {
        extractedText = await extractDocxText(arrayBuffer);
      } catch (e) {
        console.log("Could not parse as DOCX, DOC format not fully supported:", e);
        return new Response(
          JSON.stringify({ error: 'DOC format has limited support. Please convert to DOCX or PDF for best results.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (!extractedText || extractedText.length < 10) {
      return new Response(
        JSON.stringify({ error: 'Could not extract text from file. The file may be empty, corrupted, or image-based.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully extracted ${extractedText.length} characters`);

    return new Response(
      JSON.stringify({ 
        text: extractedText,
        fileName: file.name,
        fileSize: file.size
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error extracting text:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to extract text from file. Please try a different file or paste your resume text directly.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
