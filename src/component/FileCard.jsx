import { Copy, Download, Eye, FileIcon, FileText, Globe, Image, Lock, Music, MoreVertical, Sparkles, Trash, Video } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

const FileCard = ({ file, onDelete, onTogglePublic, onDownload, onShareLink }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fileId = file?.id || file?._id;
  const getFileIcon = () => {
    const ext = file?.name?.split('.')?.pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return <Image size={30} color='var(--accent-bright)' strokeWidth={1.5} />;
    if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) return <Video size={30} color='#60a5fa' strokeWidth={1.5} />;
    if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext)) return <Music size={30} color='var(--green)' strokeWidth={1.5} />;
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) return <FileText size={30} color='var(--yellow)' strokeWidth={1.5} />;
    return <FileIcon size={30} color='var(--text-muted)' strokeWidth={1.5} />;
  };
  const formatSize = (b = 0) => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
  const publicLink = `${window.location.origin}/file/${fileId}`;
  const handleCopy = () => { navigator.clipboard.writeText(publicLink); toast.success('Link copied!'); setMenuOpen(false); };

  return (
    <div style={{ position: 'relative', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden', transition: `border-color var(--duration) var(--ease)` }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
      <div style={{ height: '100px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {getFileIcon()}
      </div>
      <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: 'var(--radius-pill)', fontSize: '11px', fontWeight: 600, background: 'var(--bg-card)', color: file?.isPublic ? 'var(--green)' : 'var(--text-muted)', border: `1px solid ${file?.isPublic ? 'var(--green)' : 'var(--border)'}` }}>
          {file?.isPublic ? <><Globe size={9} />Public</> : <><Lock size={9} />Private</>}
        </div>
      </div>
      <div style={{ position: 'absolute', top: '8px', right: '8px' }} ref={menuRef}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
          <MoreVertical size={13} />
        </button>
        {menuOpen && (
          <div style={{ position: 'absolute', right: 0, top: '34px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', boxShadow: '0 12px 28px rgba(0,0,0,0.35)', padding: '6px', width: '160px', zIndex: 10 }}>
            {[
              file?.isPublic && { label: 'Share', icon: Copy, onClick: () => { onShareLink ? onShareLink(fileId) : handleCopy(); setMenuOpen(false); }, color: 'var(--accent-bright)' },
              file?.isPublic && { label: 'View file', icon: Eye, onClick: () => { window.open(publicLink, '_blank'); setMenuOpen(false); }, color: '#60a5fa' },
              { label: 'Download', icon: Download, onClick: () => { onDownload(file); setMenuOpen(false); }, color: 'var(--green)' },
              { label: file?.isPublic ? 'Make private' : 'Make public', icon: file?.isPublic ? Lock : Globe, onClick: () => { onTogglePublic(file); setMenuOpen(false); }, color: 'var(--yellow)' },
              null,
              { label: 'Delete', icon: Trash, onClick: () => { onDelete(fileId); setMenuOpen(false); }, color: 'var(--red)' },
            ].filter(Boolean).map((item, i) => item === null ? (
              <div key={i} style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
            ) : (
              <button key={i} onClick={item.onClick}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: 'transparent', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', transition: `all var(--duration) var(--ease)`, textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = item.color; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                <item.icon size={14} />{item.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '3px' }} title={file?.name}>{file?.name}</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatSize(file?.size)}</p>
        {file?.aiStatus === 'PENDING' && (
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <Sparkles size={10} /> Summarizing…
          </p>
        )}
        {file?.summary && (
          <p title={file.summary} style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
            {file.summary}
          </p>
        )}
      </div>
    </div>
  );
};
export default FileCard;
