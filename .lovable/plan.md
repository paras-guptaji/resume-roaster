

# Add PDF/DOC File Upload with Text Extraction

Add the ability to upload PDF or DOCX files alongside the existing paste text option, with automatic text extraction.

---

## Overview

Currently, users can only paste resume text manually. This plan adds:
- Tab-based input switching (Paste Text / Upload File)
- Drag-and-drop file upload zone
- Server-side PDF and DOCX text extraction
- Loading state during extraction
- Error handling for unsupported files

---

## Implementation Approach

### 1. Create File Upload Edge Function

**New file: `supabase/functions/extract-resume/index.ts`**

A dedicated edge function to handle file uploads and extract text:

- Accept multipart/form-data with file upload
- Detect file type (PDF vs DOCX)
- **PDF extraction**: Use `pdfjs-serverless` library (designed for Deno/serverless)
- **DOCX extraction**: Use `mammoth` library to convert DOCX to text
- Return extracted text to the frontend
- Handle errors gracefully (corrupted files, unsupported formats)

```text
┌─────────────────────────────────────────────────────────┐
│                   extract-resume                         │
├─────────────────────────────────────────────────────────┤
│  Input: FormData with file                              │
│                                                         │
│  1. Parse multipart form data                           │
│  2. Detect file type (.pdf or .docx)                    │
│  3. Extract text using appropriate library              │
│  4. Return { text: "extracted content" }                │
│                                                         │
│  Supported: PDF, DOC, DOCX                              │
│  Max size: 10MB                                         │
└─────────────────────────────────────────────────────────┘
```

### 2. Update Resume Input Component

**Modify: `src/components/ResumeInput.tsx`**

Transform into a tabbed interface:

```text
┌─────────────────────────────────────────┐
│  [📝 Paste Text]  [📄 Upload File]      │
├─────────────────────────────────────────┤
│                                         │
│  Tab 1: Current textarea (unchanged)    │
│                                         │
│  Tab 2: Drag-and-drop zone              │
│         - Visual drop area              │
│         - File icon + instructions      │
│         - Supported formats badge       │
│         - Or click to browse            │
│                                         │
└─────────────────────────────────────────┘
```

**New features:**
- Tabs component to switch input modes
- Hidden file input with accept=".pdf,.doc,.docx"
- Drag-and-drop support with visual feedback
- File size validation (max 10MB)
- Loading spinner during extraction
- Success state showing extracted text preview
- Clear button to remove uploaded file

### 3. Create File Upload Hook

**New file: `src/hooks/useFileExtraction.ts`**

Custom hook to handle file upload logic:

- `uploadAndExtract(file: File)` - sends file to edge function
- `isExtracting` - loading state
- `extractedText` - result text
- `error` - error message
- `reset()` - clear state

### 4. Update Resume Form

**Modify: `src/components/ResumeForm.tsx`**

- Integrate file extraction with existing flow
- When file is uploaded, extracted text populates the content state
- User can still edit extracted text before submitting
- Same validation applies (min 50 characters)

### 5. Update Supabase Config

**Modify: `supabase/config.toml`**

Add the new edge function configuration:

```toml
[functions.extract-resume]
verify_jwt = false
```

---

## User Experience Flow

```text
User lands on page
       │
       ▼
┌──────────────────────┐
│ Choose input method  │
├──────────────────────┤
│ [Paste] or [Upload]  │
└──────────────────────┘
       │
       ├── Paste Text ──► Types/pastes resume
       │
       └── Upload File
              │
              ▼
       ┌──────────────────┐
       │ Drag PDF/DOCX    │
       │ or click browse  │
       └──────────────────┘
              │
              ▼
       ┌──────────────────┐
       │ "Extracting..."  │
       │ (loading state)  │
       └──────────────────┘
              │
              ▼
       ┌──────────────────┐
       │ Text extracted!  │
       │ Preview shown    │
       │ [Edit] [Clear]   │
       └──────────────────┘
              │
              ▼
       Continue with role selection
       and intensity slider...
```

---

## Technical Details

### PDF Extraction (pdfjs-serverless)

```typescript
import { getDocument } from 'https://esm.sh/pdfjs-serverless';

const doc = await getDocument({ data: pdfBytes }).promise;
let fullText = '';

for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const textContent = await page.getTextContent();
  const pageText = textContent.items
    .map((item: any) => item.str)
    .join(' ');
  fullText += pageText + '\n';
}
```

### DOCX Extraction (mammoth)

```typescript
import mammoth from 'https://esm.sh/mammoth';

const result = await mammoth.extractRawText({
  arrayBuffer: docxBytes
});
const text = result.value;
```

### File Upload UI States

| State | Visual |
|-------|--------|
| **Idle** | Dashed border, upload icon, "Drag & drop or click" |
| **Drag over** | Highlighted border, pulsing animation |
| **Uploading** | Spinner, "Extracting text from your resume..." |
| **Success** | Green checkmark, file name, text preview, Clear button |
| **Error** | Red border, error message, Retry button |

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `supabase/functions/extract-resume/index.ts` | Create | Text extraction edge function |
| `src/hooks/useFileExtraction.ts` | Create | File upload hook |
| `src/components/ResumeInput.tsx` | Modify | Add tabs + upload zone |
| `src/components/ResumeForm.tsx` | Modify | Integrate extraction flow |
| `supabase/config.toml` | Modify | Add function config |

---

## Validation & Constraints

- **Max file size**: 10MB
- **Supported formats**: PDF, DOC, DOCX
- **Min extracted text**: 50 characters (same as paste)
- **Error messages**: Clear, helpful text for each failure case

