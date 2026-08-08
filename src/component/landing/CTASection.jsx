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
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>Upload Files</h2>

      <div {...getRootProps()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${isDragActive ? 'var(--accent-bright)' : 'var(--accent)'}`, borderRadius: '16px', padding: '48px 24px', cursor: 'pointer', transition: 'all 0.2s', background: isDragActive ? 'var(--accent-dim)' : 'var(--accent-glow)', minHeight: '200px' }}>
        <input {...getInputProps()} />
        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: isDragActive ? 'var(--accent)' : 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', transition: 'all 0.2s' }}>
          <UploadCloud size={28} color={isDragActive ? '#fff' : 'var(--accent-bright)'} />
        </div>
        <p style={{ fontSize: '15px', fontWeight: 500, color: isDragActive ? 'var(--accent-bright)' : 'var(--text-secondary)', textAlign: 'center', marginBottom: '6px' }}>
          {isDragActive ? "Drop files here..." : title}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Max {maxFiles} files at once</p>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
          {files.map((file, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{file.name}</span>
              <button onClick={() => onRemoveFile(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '2px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {remainingCredits !== undefined && (
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: '10px', padding: '10px 14px' }}>
          <Zap size={15} color='var(--accent-bright)' />
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Credits remaining: <strong style={{ color: 'var(--accent-bright)' }}>{remainingCredits}</strong></span>
        </div>
      )}

      <button onClick={onUpload} disabled={isUploadDisabled}
        style={{ marginTop: '16px', width: '100%', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: 600, cursor: isUploadDisabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s', background: isUploadDisabled ? 'var(--bg-elevated)' : 'var(--accent)', color: isUploadDisabled ? 'var(--text-muted)' : '#fff', boxShadow: isUploadDisabled ? 'none' : '0 4px 20px var(--accent-glow)' }}>
        {uploading ? "Uploading..." : "Upload Files"}
      </button>
    </div>
  );
};
export default UploadBox;
