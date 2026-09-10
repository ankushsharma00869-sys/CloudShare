import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";

import { UserCreditsContext } from "../context/UserCreditsContext";
import apiEndPoints from "../Util/apiEndpoints";
import axiosInstance from "../Util/axiosInstance";
import { Upload, FileText, FileImage, File, Lock, Cloud, TrendingUp, HardDrive } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={22} color={color} />
    </div>
    <div>
      <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Manrope', sans-serif" }}>{value}</div>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
    </div>
  </div>
)

// Returns true if the given uploadedAt timestamp falls on today's calendar date.
// `uploadedAt` comes from the backend as a LocalDateTime (no timezone offset in
// the ISO string, e.g. "2026-09-10T10:15:30"). The server writes it with
// LocalDateTime.now() using the server's clock (UTC on our deployment), so we
// normalize it to a real UTC instant (append "Z" when no offset is present)
// before comparing it against "today" in the viewer's own local timezone. This
// keeps the day boundary correct no matter what timezone the user is in.
const isUploadedToday = (uploadedAt) => {
  if (!uploadedAt) return false;
  const hasOffset = /Z$|[+-]\d{2}:\d{2}$/.test(uploadedAt);
  const parsed = new Date(hasOffset ? uploadedAt : `${uploadedAt}Z`);
  if (Number.isNaN(parsed.getTime())) return false;

  const now = new Date();
  return (
    parsed.getFullYear() === now.getFullYear() &&
    parsed.getMonth() === now.getMonth() &&
    parsed.getDate() === now.getDate()
  );
};

const Dashboard = () => {
  const [allFiles, setAllFiles] = useState([]); // full set for this user — single source of truth for all dashboard stats
  const [files, setFiles] = useState([]); // top 5 most recent, derived from allFiles
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statsError, setStatsError] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
    const { fetchUserCredits } = useContext(UserCreditsContext);
  // Max files that can be staged in the upload box in one batch — unrelated to
  // the "Uploads Today" stat (that one comes from real upload records below).
  const MAX_FILES_PER_BATCH = 5;

  const getFileIcon = (name) => {
    const ext = name?.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText size={16} color='#f97316' />;
    if (["png", "jpg", "jpeg"].includes(ext)) return <FileImage size={16} color='#9d7fff' />;
    return <File size={16} color='#60a5fa' />;
  };

  const formatSize = (size) => {
    if (size > 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + " MB";
    return (size / 1024).toFixed(1) + " KB";
  };

  // Single source of truth for every dashboard stat + the Recent Files table:
  // GET /files/my, the same endpoint My Files uses, already filtered to the
  // authenticated user by the backend (fileMetaDataRepository.findByUserId).
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setStatsError(false);
      const res = await axiosInstance.get(apiEndPoints.FETCH_FILES);
      const sorted = [...res.data].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      setAllFiles(sorted);
      setFiles(sorted.slice(0, 5));
    } catch (err) {
      console.error(err);
      setStatsError(true);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  // Derived, not stored — always recomputed from the same allFiles array that
  // backs Recent Files, so the two can never drift out of sync.
  const uploadsToday = allFiles.filter(f => isUploadedToday(f.uploadedAt)).length;
  const totalStorageBytes = allFiles.reduce((sum, f) => sum + (f.size || 0), 0);

  const handleFileChange = (e) => setUploadingFiles(Array.from(e.target.files));
  const handleRemoveFile = (i) => { const u = [...uploadingFiles]; u.splice(i, 1); setUploadingFiles(u); };

  const handleUpload = async () => {
    if (uploadingFiles.length === 0) { setMessage("Please select files"); setMessageType("error"); return; }
    setUploading(true); setMessage("Uploading..."); setMessageType("info");
    const formData = new FormData();
    uploadingFiles.forEach(f => formData.append("files", f));
    try {
            await axiosInstance.post(apiEndPoints.UPLOAD_FILE, formData);
      setMessage("Upload successful!"); setMessageType("success"); setUploadingFiles([]);
      fetchDashboardData(); fetchUserCredits();
    } catch { setMessage("Upload failed"); setMessageType("error"); }
    finally { setUploading(false); }
  };

  const msgColors = { error: ['var(--red-dim)', 'var(--red)'], success: ['var(--green-dim)', 'var(--green)'], info: ['var(--accent-dim)', 'var(--accent-bright)'] };

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div style={{ padding: '32px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>My Drive</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Upload, manage, and share your files securely</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: statsError ? '12px' : '32px' }}>
          <StatCard icon={File} label="Recent Files" value={files.length} color='#9d7fff' />
          <StatCard icon={Cloud} label="Uploads Today" value={loading ? '—' : uploadsToday} color='#22c55e' />
          <StatCard icon={HardDrive} label="Storage Used" value={loading ? '—' : formatSize(totalStorageBytes)} color='#60a5fa' />
        </div>
        {statsError && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid var(--red)30', fontSize: '13px' }}>
            Couldn't load your stats. <button onClick={fetchDashboardData} style={{ background: 'none', border: 'none', color: 'var(--red)', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px', padding: 0 }}>Retry</button>
          </div>
        )}

        {message && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', background: msgColors[messageType]?.[0] || 'var(--bg-elevated)', color: msgColors[messageType]?.[1] || 'var(--text-primary)', border: `1px solid ${msgColors[messageType]?.[1] || 'var(--border)'}30`, fontSize: '14px' }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap' }}>
          {/* Upload Box */}
          <div style={{ flex: '0 0 340px', minWidth: '280px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '16px' }}>Upload Files</h2>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '100px', padding: '3px 10px' }}>
                  {MAX_FILES_PER_BATCH - uploadingFiles.length}/{MAX_FILES_PER_BATCH} left
                </span>
              </div>
              <label style={{ border: '2px dashed var(--accent)', borderRadius: '14px', minHeight: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', background: 'var(--accent-glow)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dim)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-glow)'}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <Upload size={22} color='var(--accent-bright)' />
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Drag & drop files here</p>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>or click to browse</span>
                <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {uploadingFiles.map((file, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{file.name}</span>
                    <button onClick={() => handleRemoveFile(i)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, flexShrink: 0 }}>Remove</button>
                  </div>
                ))}
              </div>
              <button onClick={handleUpload}
                style={{ width: '100%', marginTop: '16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 20px var(--accent-glow)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-bright)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}>
                {uploading ? "Uploading..." : "Upload Files"}
              </button>
            </div>
          </div>

          {/* Recent Files */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '16px' }}>Recent Files</h2>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{files.length} files</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-elevated)' }}>
                      {['Name', 'Size', 'Uploaded By', 'Modified', 'Sharing'].map(h => (
                        <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
                    ) : files.length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No recent files</td></tr>
                    ) : files.map((file, i) => (
                      <tr key={i}
                        style={{ borderTop: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {getFileIcon(file.name)}
                            <span style={{ fontSize: '14px', color: 'var(--text-primary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{formatSize(file.size)}</td>
                        <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-secondary)' }}>You</td>
                        <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{new Date(file.uploadedAt).toLocaleDateString()}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                            <Lock size={12} /> Private
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
