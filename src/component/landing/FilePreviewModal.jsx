import React, { useState } from "react";
import { X, Download, AlertTriangle, FileIcon } from "lucide-react";

// Decides how to render a given file based on its extension/mime type.
// Falls back to a "no preview available" state for anything unsupported
// (e.g. .zip, .exe) instead of trying (and failing) to render it inline.
const getPreviewKind = (file) => {
  const ext = file?.name?.split(".")?.pop()?.toLowerCase();
  const type = file?.type || "";

  if (type.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(ext)) return "image";
  if (type.startsWith("video/") || ["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "video";
  if (type.startsWith("audio/") || ["mp3", "wav", "ogg", "flac", "m4a"].includes(ext)) return "audio";
  if (type === "application/pdf" || ext === "pdf") return "pdf";
  return "unsupported";
};

const FilePreviewModal = ({ isOpen, onClose, file, onDownload }) => {
  const [mediaError, setMediaError] = useState(false);
  if (!isOpen || !file) return null;

  const kind = getPreviewKind(file);
  // fileLocation is the direct Cloudinary URL already returned by GET /files/my
  // for this user's own files (ownership already enforced server-side), so no
  // extra API call is needed to render a preview.
  const src = file.fileLocation;

  const renderBody = () => {
    if (mediaError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '48px 24px', color: 'var(--text-muted)' }}>
          <AlertTriangle size={28} color='var(--yellow)' />
          <p style={{ fontSize: '14px' }}>Couldn't load a preview for this file.</p>
        </div>
      );
    }

    switch (kind) {
      case "image":
        return (
          <img
            src={src}
            alt={file.name}
            onError={() => setMediaError(true)}
            style={{ maxWidth: '100%', maxHeight: '65vh', display: 'block', margin: '0 auto', borderRadius: '10px', objectFit: 'contain' }}
          />
        );
      case "video":
        return (
          <video
            src={src}
            controls
            autoPlay={false}
            onError={() => setMediaError(true)}
            style={{ maxWidth: '100%', maxHeight: '65vh', display: 'block', margin: '0 auto', borderRadius: '10px', background: '#000' }}
          />
        );
      case "audio":
        return (
          <div style={{ padding: '32px 16px' }}>
            <audio src={src} controls onError={() => setMediaError(true)} style={{ width: '100%' }} />
          </div>
        );
      case "pdf":
        return (
          <iframe
            title={file.name}
            src={src}
            onError={() => setMediaError(true)}
            style={{ width: '100%', height: '65vh', border: 'none', borderRadius: '10px', background: '#fff' }}
          />
        );
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '48px 24px', color: 'var(--text-muted)' }}>
            <FileIcon size={32} />
            <p style={{ fontSize: '14px', textAlign: 'center' }}>Preview isn't available for this file type.<br />Download it to view the contents.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '16px' }} onClick={onClose}>
      <div
        style={{ width: '100%', maxWidth: '760px', maxHeight: '90vh', overflow: 'auto', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '20px', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)', gap: '12px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={file.name}>{file.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {onDownload && (
              <button onClick={() => onDownload(file)} title="Download" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <Download size={14} /> Download
              </button>
            )}
            <button onClick={onClose} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              <X size={16} />
            </button>
          </div>
        </div>
        <div style={{ padding: '20px 24px' }}>
          {renderBody()}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
