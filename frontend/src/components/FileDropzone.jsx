import { useRef, useState } from "react";
import { CheckCircle2, FileText, UploadCloud } from "lucide-react";

import Button from "./Button.jsx";

export default function FileDropzone({ fileMeta, isUploading, onFile }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={[
        "group relative flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition",
        isDragging
          ? "border-violetGlow bg-violetGlow/10"
          : "border-slate-300/80 bg-white/45 hover:border-blueGlow hover:bg-white/65",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
        }}
      />

      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-ink text-white shadow-soft">
        {fileMeta?.filename ? <CheckCircle2 className="h-7 w-7" /> : <UploadCloud className="h-7 w-7" />}
      </div>

      <h2 className="text-xl font-semibold text-ink">
        {fileMeta?.filename ? fileMeta.filename : "Drop resume PDF"}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
        {fileMeta?.character_count
          ? `${fileMeta.character_count.toLocaleString()} characters extracted across ${fileMeta.page_count} page${fileMeta.page_count === 1 ? "" : "s"}.`
          : "Upload a PDF file with selectable text."}
      </p>

      <Button
        type="button"
        variant="secondary"
        icon={FileText}
        isLoading={isUploading}
        className="mt-6"
        onClick={() => inputRef.current?.click()}
      >
        {fileMeta?.filename ? "Replace PDF" : "Choose PDF"}
      </Button>
    </div>
  );
}
