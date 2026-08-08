import React, { useContext, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';

import { UserCreditsContext } from '../context/UserCreditsContext';
import { AlertCircle, Crown } from 'lucide-react';
import axiosInstance from '../Util/axiosInstance';
import apiEndPoints from '../Util/apiEndpoints';
import UploadBox from "../component/UploadBox.jsx";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
    const { credits, setCredits, plan, maxFileSizeMb } = useContext(UserCreditsContext);
    const navigate = useNavigate();
  const MAX_FILES = 10;
  const maxFileSizeBytes = (maxFileSizeMb || 25) * 1024 * 1024;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target?.files || []);
    if (files.length + selectedFiles.length > MAX_FILES) { setMessage(`Max ${MAX_FILES} files at once`); setMessageType("error"); return; }

    // 🔒 Plan-gated perk: block oversized files client-side too (backend still enforces this for real)
    const oversized = selectedFiles.find(f => f.size > maxFileSizeBytes);
    if (oversized) {
      setMessage(`"${oversized.name}" is ${(oversized.size / (1024 * 1024)).toFixed(1)}MB, which exceeds your plan's ${maxFileSizeMb}MB limit per file. Upgrade to Ultimate to upload files up to 200MB.`);
      setMessageType("upgrade");
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]); setMessage(""); setMessageType("");
  };
  const handleRemoveFile = (index) => { setFiles(prev => prev.filter((_, i) => i !== index)); setMessage(""); setMessageType(""); };
  const handleUpload = async () => {
    if (files.length === 0) { setMessage("Please select at least one file"); setMessageType("error"); return; }
    setUploading(true); setMessage("Uploading files..."); setMessageType("info");
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    try {
            const response = await axiosInstance.post(apiEndPoints.UPLOAD_FILE, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (response.data?.remainingCredits !== undefined) setCredits(response.data.remainingCredits);
      setMessage("Files uploaded successfully."); setMessageType("success"); setFiles([]);
    } catch (error) {
      const status = error.response?.status;
      setMessage(error.response?.data?.message || "Error uploading files. Please try again");
      setMessageType(status === 413 ? "upgrade" : "error");
    } finally { setUploading(false); }
  };

  const isUploadDisabled = files.length === 0 || files.length > MAX_FILES || credits <= 0 || files.length > credits;
  const msgColors = { error: ['var(--red-dim)', 'var(--red)'], success: ['var(--green-dim)', 'var(--green)'], info: ['var(--accent-dim)', 'var(--accent-bright)'], upgrade: ['var(--yellow-dim, #4a3a0f)', 'var(--yellow, #eab308)'] };

  return (
    <DashboardLayout activeMenu="Upload">
      <div style={{ padding: '32px 24px' }}>
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Upload Files</h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Upload and manage your files securely</p>
          </div>
          {/* 🔒 Plan-gated perk indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px', background: plan === 'ULTIMATE' ? 'var(--accent-dim)' : 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            {plan === 'ULTIMATE' && <Crown size={14} color="var(--accent-bright)" />}
            <span style={{ fontSize: '13px', color: plan === 'ULTIMATE' ? 'var(--accent-bright)' : 'var(--text-secondary)', fontWeight: 500 }}>
              Max file size: {maxFileSizeMb || 25}MB {plan !== 'ULTIMATE' && '(Ultimate: up to 200MB)'}
            </span>
          </div>
        </div>
        {message && (
          <div style={{ marginTop: '16px', marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', background: msgColors[messageType]?.[0], color: msgColors[messageType]?.[1], border: `1px solid ${msgColors[messageType]?.[1]}30`, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {(messageType === "error" || messageType === "upgrade") && <AlertCircle size={16} />}{message}
            </span>
            {messageType === 'upgrade' && (
              <button onClick={() => navigate('/subscription')} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Upgrade to Ultimate
              </button>
            )}
          </div>
        )}
        <div style={{ maxWidth: '560px', marginTop: message ? 0 : '20px' }}>
          <UploadBox files={files} onFileChange={handleFileChange} onUpload={handleUpload} uploading={uploading} onRemoveFile={handleRemoveFile} remainingCredits={credits} isUploadDisabled={isUploadDisabled} onError={(msg) => { setMessage(msg); setMessageType("error"); }} />
        </div>
      </div>
    </DashboardLayout>
  );
};
export default Upload;