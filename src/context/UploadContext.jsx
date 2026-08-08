import axiosInstance from '../Util/axiosInstance';
import { createContext, useCallback, useContext, useState } from 'react';
import apiEndPoints from '../Util/apiEndpoints';
import toast from 'react-hot-toast';
import { UserCreditsContext } from './UserCreditsContext';

export const UploadContext = createContext();

// AI Feature support note: this context lives above the router (in App.jsx),
// so navigating between pages (Upload -> Transactions -> My Files) does NOT
// unmount it, and the axios upload request keeps running in the background.
export const UploadProvider = ({ children }) => {
  const { setCredits } = useContext(UserCreditsContext);

  // uploadJobs: array of { id, fileNames, status, progress, error }
  const [uploadJobs, setUploadJobs] = useState([]);

  const updateJob = useCallback((id, patch) => {
    setUploadJobs(prev => prev.map(job => (job.id === id ? { ...job, ...patch } : job)));
  }, []);

  const removeJob = useCallback((id) => {
    setUploadJobs(prev => prev.filter(job => job.id !== id));
  }, []);

  // Starts an upload that keeps running even if the user navigates away.
  const startUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    const jobId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const fileNames = files.map(f => f.name);

    setUploadJobs(prev => [
      ...prev,
      { id: jobId, fileNames, status: 'uploading', progress: 0, error: null },
    ]);

    const formData = new FormData();
    files.forEach(f => formData.append('files', f));

    try {
      // Authorization header attached automatically by axiosInstance.
      const response = await axiosInstance.post(apiEndPoints.UPLOAD_FILE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const percent = Math.round((evt.loaded * 100) / evt.total);
          updateJob(jobId, { progress: percent });
        },
      });

      if (response.data?.remainingCredits !== undefined) {
        setCredits(response.data.remainingCredits);
      }

      updateJob(jobId, { status: 'done', progress: 100 });
      toast.success(`${fileNames.length} file${fileNames.length > 1 ? 's' : ''} uploaded successfully`);

      // Auto-clear the success notice after a few seconds
      setTimeout(() => removeJob(jobId), 4000);
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed. Please try again.';
      updateJob(jobId, { status: 'error', error: message });
      toast.error(message);
    }
  }, [setCredits, updateJob, removeJob]);

  const isUploading = uploadJobs.some(job => job.status === 'uploading');

  const contextValue = {
    uploadJobs,
    startUpload,
    removeJob,
    isUploading,
  };

  return (
    <UploadContext.Provider value={contextValue}>
      {children}
    </UploadContext.Provider>
  );
};
