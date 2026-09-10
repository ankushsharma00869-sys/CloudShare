import { Copy, Download, Eye, FileIcon, FileText, Globe, Image, Lock, Loader2, Music, MoreVertical, Share2, Sparkles, Trash, Video } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

const ActionButton = ({ icon: Icon, label, onClick, color, disabled, loading }) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '30px', height: '30px', borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)', background: 'var(--bg-elevated)',
      color: disabled ? 'var(--text-muted)' : color, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1, transition: `all var(--duration) var(--ease)`, flexShrink: 0,
    }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = color; } }}
    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
  >
    {loading ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
  </button>
);

const FileCard = ({ file, onDelete, onTogglePublic, onDownload, onShareLink, onPreview, downloading, togglingPublic }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fileId = file?.id || file?._id;
  const isPublic = !!file?.isPublic;
  const getFileIcon = () => {
    const ext = file?.name?.split('.')?.pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return <Image size={30} color='var(--accent-bright)' strokeWidth={1.5} />;
    if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) return <Video size={30} color='#60a5fa' strokeWidth={1.5} />;
    if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext)) return <Music size={30} color='var(--green)' strokeWidth={1.5} />;
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) return <FileText size={30} color='var(--yellow)' strokeWidth={1.5} />;
    return <FileIcon size={30} color='var(--text-muted)' strokeWidth={1.5} />;
  };
  const formatSize = (b = 0) => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
  // Actual share URL for this file. Only meaningful once the file is public -
  // the backend rejects /files/public/{id} and /files/view/{id} for private files.
  const publicLink = `${window.location.origin}/file/${fileId}`;

  const handleCopyLink = () => {
    if (!isPublic) {
      toast.error('Make this file public first to get a share link');
      return;
    }
    navigator.clipboard.writeText(publicLink);
    toast.success('Link copied!');
  };

  const handlePreview = () => {
    if (onPreview) onPreview(file);
  };

  return (
    <div style={{ position: 'relative', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden', transition: `border-color var(--duration) var(--ease)`, display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
      <div
        onClick={handlePreview}
        style={{ height: '100px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: onPreview ? 'pointer' : 'default' }}
      >
        {getFileIcon()}
      </div>
      <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: 'var(--radius-pill)', fontSize: '11px', fontWeight: 600, background: 'var(--bg-card)', color: isPublic ? 'var(--green)' : 'var(--text-muted)', border: `1px solid ${isPublic ? 'var(--green)' : 'var(--border)'}` }}>
          {isPublic ? <><Globe size={9} />Public</> : <><Lock size={9} />Private</>}
        </div>
      </div>
      <div style={{ position: 'absolute', top: '8px', right: '8px' }} ref={menuRef}>
        <button onClick={() => setMenuOpen(!menuOpen)} title="More options" aria-label="More options" style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
          <MoreVertical size={13} />
        </button>
        {menuOpen && (
          <div style={{ position: 'absolute', right: 0, top: '34px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', boxShadow: '0 12px 28px rgba(0,0,0,0.35)', padding: '6px', width: '170px', zIndex: 10 }}>
            {[
              isPublic && { label: 'View raw file', icon: Eye, onClick: () => { window.open(file.fileLocation || publicLink, '_blank'); setMenuOpen(false); }, color: '#60a5fa' },
              { label: togglingPublic ? 'Updating…' : (isPublic ? 'Make private' : 'Make public'), icon: isPublic ? Lock : Globe, onClick: () => { if (!togglingPublic) { onTogglePublic(file); setMenuOpen(false); } }, color: 'var(--yellow)', disabled: togglingPublic },
              onDelete && null, // divider before delete
              onDelete && { label: 'Delete', icon: Trash, onClick: () => { onDelete(fileId); setMenuOpen(false); }, color: 'var(--red)' },
            ].filter((item) => item !== false && item !== undefined).map((item, i) => item === null ? (
              <div key={i} style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
            ) : (
              <button key={i} onClick={item.disabled ? undefined : item.onClick} disabled={item.disabled}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: 'transparent', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: item.disabled ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: item.disabled ? 'default' : 'pointer', transition: `all var(--duration) var(--ease)`, textAlign: 'left', opacity: item.disabled ? 0.6 : 1 }}
                onMouseEnter={e => { if (!item.disabled) { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = item.color; } }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = item.disabled ? 'var(--text-muted)' : 'var(--text-secondary)'; }}>
                <item.icon size={14} />{item.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: 'var(--space-3) var(--space-4)', flex: 1 }}>
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
      {/* Quick actions: Preview, Download, Share, Copy Link — always present ("where
          applicable" is handled via disabled state, not by hiding the button) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 var(--space-4) var(--space-3)', flexWrap: 'wrap' }}>
        <ActionButton icon={Eye} label="Preview" color="#60a5fa" onClick={handlePreview} />
        <ActionButton icon={Download} label="Download" color="var(--green)" onClick={() => onDownload(file)} loading={downloading} disabled={downloading} />
        <ActionButton
          icon={Share2}
          label={isPublic ? 'Share' : 'Make public to share'}
          color="var(--accent-bright)"
          onClick={() => { if (isPublic) { onShareLink ? onShareLink(fileId) : handleCopyLink(); } else { toast.error('Make this file public first to share it'); } }}
          disabled={!isPublic}
        />
        <ActionButton
          icon={Copy}
          label={isPublic ? 'Copy share link' : 'Make public to copy link'}
          color="var(--accent-bright)"
          onClick={handleCopyLink}
          disabled={!isPublic}
        />
      </div>
    </div>
  );
};
export default FileCard;
