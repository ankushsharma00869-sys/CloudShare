import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiEndPoints from "../Util/apiEndpoints";
import toast from "react-hot-toast";
import { Copy, Share2, Download, File, CheckCircle2, X } from "lucide-react";

const PublicFileView = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareModal, setShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { fileId } = useParams();
  const publicLink = `${window.location.origin}/file/${fileId}`;

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await axios.get(apiEndPoints.PUBLIC_FILE_VIEW(fileId));
        setFile(res.data);
      } catch { toast.error("File not found or private"); }
      finally { setLoading(false); }
    };
    fetchFile();
  }, [fileId]);

  const handleDownload = async () => {
    try {
      const res = await axios.get(apiEndPoints.DOWNLOAD_FILE(fileId), { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a"); a.href = url; a.download = file.name; a.click(); window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch { toast.error("Download failed"); }
  };
  const copyLink = () => { navigator.clipboard.writeText(publicLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const formatSize = (b = 0) => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-base)', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading file...</p>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!file) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-base)', gap: '16px' }}>
      <div style={{ width: '64px', height: '64px', background: 'var(--red-dim)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <File size={28} color='var(--red)' />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>File not found</h2>
      <p style={{ color: 'var(--text-secondary)' }}>This file may be private or no longer exists.</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share2 size={16} color='#fff' />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>CloudShare</span>
        </div>
        <button onClick={() => setShareModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', background: 'var(--accent)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          <Share2 size={15} /> Share
        </button>
      </header>

      <main style={{ display: 'flex', justifyContent: 'center', padding: '48px 16px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', width: '100%', maxWidth: '520px', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--bg-elevated), var(--bg-surface))', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <File size={36} color='var(--accent-bright)' />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{file.name}</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>{formatSize(file.size)}</p>
            </div>
          </div>
          <div style={{ padding: '28px' }}>
            <button onClick={handleDownload} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: 'var(--accent)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginBottom: '24px', transition: 'all 0.2s', boxShadow: '0 4px 20px var(--accent-glow)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-bright)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}>
              <Download size={18} /> Download file
            </button>
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>File Details</div>
              {[['File name', file.name], ['File type', file.type || '—'], ['Size', formatSize(file.size)], ['Shared on', formatDate(file.createdAt)]].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: '12px', padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <Share2 size={15} color='var(--accent-bright)' style={{ flexShrink: 0, marginTop: '1px' }} />
              Anyone with this link can view and download this file.
            </div>
          </div>
        </div>
      </main>

      {shareModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px', backdropFilter: 'blur(8px)' }} onClick={e => e.target === e.currentTarget && setShareModal(false)}>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '20px', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', width: '100%', maxWidth: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>Share this file</h3>
              <button onClick={() => setShareModal(false)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={publicLink} readOnly style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'monospace', outline: 'none', minWidth: 0 }} />
              <button onClick={copyLink} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: copied ? 'var(--green)' : 'var(--accent)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px' }}>Anyone with this link can download the file.</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default PublicFileView;
