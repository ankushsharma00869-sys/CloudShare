import React, { useContext } from 'react';
import { UploadContext } from '../context/UploadContext';
import { UploadCloud, CheckCircle2, AlertCircle, X } from 'lucide-react';

// Shows in the bottom-right corner on every page, since it's rendered once
// at the App level (outside the router). Lets the user keep navigating
// while an upload runs in the background.
const GlobalUploadToast = () => {
  const { uploadJobs, removeJob } = useContext(UploadContext);

  if (uploadJobs.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px',
    }}>
      {uploadJobs.map(job => (
        <div key={job.id} style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px',
          padding: '14px 16px', boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            {job.status === 'uploading' && <UploadCloud size={16} color="var(--accent-bright)" />}
            {job.status === 'done' && <CheckCircle2 size={16} color="var(--green)" />}
            {job.status === 'error' && <AlertCircle size={16} color="var(--red)" />}

            <span style={{ fontSize: '13px', color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {job.fileNames.length === 1 ? job.fileNames[0] : `${job.fileNames.length} files`}
            </span>

            <button onClick={() => removeJob(job.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              <X size={14} />
            </button>
          </div>

          {job.status === 'uploading' && (
            <div style={{ width: '100%', height: '6px', borderRadius: '4px', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
              <div style={{ width: `${job.progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.2s' }} />
            </div>
          )}

          {job.status === 'error' && (
            <p style={{ fontSize: '12px', color: 'var(--red)', margin: 0 }}>{job.error}</p>
          )}

          {job.status === 'done' && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Upload complete</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default GlobalUploadToast;
