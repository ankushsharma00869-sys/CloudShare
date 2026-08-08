import React, { useContext, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';

import { UserCreditsContext } from '../context/UserCreditsContext';
import { AlertCircle } from 'lucide-react';
import axiosInstance from '../Util/axiosInstance';
import apiEndPoints from '../Util/apiEndpoints';
import UploadBox from "../component/UploadBox.jsx";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
    const { credits, setCredits } = useContext(UserCreditsContext);
  const MAX_FILES = 10;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target?.files || []);
    if (files.length + selectedFiles.length > MAX_FILES) { setMessage(`Max ${MAX_FILES} files at once`); setMessageType("error"); return; }
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
      setMessage(error.response?.data?.message || "Error uploading files. Please try again"); setMessageType("error");
    } finally { setUploading(false); }
  };

  const isUploadDisabled = files.length === 0 || files.length > MAX_FILES || credits <= 0 || files.length > credits;
  const msgColors = { error: ['var(--red-dim)', 'var(--red)'], success: ['var(--green-dim)', 'var(--green)'], info: ['var(--accent-dim)', 'var(--accent-bright)'] };

  return (
    <DashboardLayout activeMenu="Upload">
      <div style={{ padding: '32px 24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Upload Files</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Upload and manage your files securely</p>
        </div>
        {message && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', background: msgColors[messageType]?.[0], color: msgColors[messageType]?.[1], border: `1px solid ${msgColors[messageType]?.[1]}30`, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {messageType === "error" && <AlertCircle size={16} />}{message}
          </div>
        )}
        <div style={{ maxWidth: '560px' }}>
          <UploadBox files={files} onFileChange={handleFileChange} onUpload={handleUpload} uploading={uploading} onRemoveFile={handleRemoveFile} remainingCredits={credits} isUploadDisabled={isUploadDisabled} onError={(msg) => { setMessage(msg); setMessageType("error"); }} />
        </div>
      </div>
    </DashboardLayout>
  );
};
export default Upload;
