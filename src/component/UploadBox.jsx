import React from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Zap } from "lucide-react";

const UploadBox = ({ files = [], onFileChange, onUpload, uploading = false, onRemoveFile, remainingCredits, isUploadDisabled, maxFiles = 10, accept = {}, title = "Drag & drop files here or click to browse", onError }) => {
  const onDrop = (acceptedFiles) => {
    if (files.length + acceptedFiles.length > maxFiles) { onError?.(`Max ${maxFiles} files at once`); return; }
    onFileChange({ target: { files: acceptedFiles } });
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true, accept, preventDropOnDocument: true });

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-5)' }}>Upload files</h2>

      <div {...getRootProps()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `1px dashed ${isDragActive ? 'var(--accent-bright)' : 'var(--border-strong)'}`, borderRadius: 'var(--radius-card)', padding: 'var(--space-10) var(--space-6)', cursor: 'pointer', transition: `all var(--duration) var(--ease)`, background: isDragActive ? 'var(--accent-dim)' : 'transparent', minHeight: '180px' }}>
        <input {...getInputProps()} />
        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-card)', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
          <UploadCloud size={22} color="var(--accent-bright)" />
        </div>
        <p style={{ fontSize: '15px', fontWeight: 500, color: isDragActive ? 'var(--accent-bright)' : 'var(--text-secondary)', textAlign: 'center', marginBottom: 'var(--space-1)' }}>
          {isDragActive ? "Drop files here" : title}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Max {maxFiles} files at once</p>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: '200px', overflowY: 'auto' }}>
          {files.map((file, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{file.name}</span>
              <button onClick={() => onRemoveFile(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '2px', transition: `color var(--duration) var(--ease)` }} onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {remainingCredits !== undefined && (
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
          <Zap size={14} color="var(--accent-bright)" />
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Credits remaining: <strong style={{ color: 'var(--text-primary)' }}>{remainingCredits}</strong></span>
        </div>
      )}

      <button onClick={onUpload} disabled={isUploadDisabled}
        style={{ marginTop: 'var(--space-4)', width: '100%', padding: '13px', borderRadius: 'var(--radius-btn)', border: 'none', fontSize: '15px', fontWeight: 600, cursor: isUploadDisabled ? 'not-allowed' : 'pointer', transition: `background var(--duration) var(--ease)`, background: isUploadDisabled ? 'var(--bg-elevated)' : 'var(--accent)', color: isUploadDisabled ? 'var(--text-muted)' : '#fff' }}>
        {uploading ? "Uploading…" : "Upload files"}
      </button>
    </div>
  );
};
export default UploadBox;
