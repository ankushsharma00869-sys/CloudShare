import React, { useState, useContext, useRef } from 'react'
import apiEndPoints from "../Util/apiEndpoints.js";
import DashboardLayout from '../layout/DashboardLayout';
import { Grid, List, File, Globe, Lock, Copy, Download, FileIcon, Eye, Trash2, Image, Video, Music, FileText, Search, Sparkles, X } from 'lucide-react';

import axiosInstance from '../Util/axiosInstance';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileCard from '../component/FileCard';
import ConfirmationDialog from '../component/ConfirmationDialog.jsx';
import LinkShareModal from '../component/LinkShareModal.jsx';
import { UploadContext } from '../context/UploadContext';

function MyFiles() {
  const [files, setFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]); // 🤖 AI: unfiltered list, restored when search is cleared
  const allFilesRef = useRef([]); // always-current mirror of allFiles, read inside the debounced search handler
  useEffect(() => { allFilesRef.current = allFiles; }, [allFiles]);
  const [viewMode, setViewMode] = useState("list");
    const navigate = useNavigate();
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, fileId: null });
  const [shareModal, setShareModal] = useState({ isOpen: false, fileId: null, link: "" });

  // 🤖 AI Feature: Smart File Search (semantic search) state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchFiles = async () => {
    try {
      const response = await axiosInstance.get(apiEndPoints.FETCH_FILES);
      if (response.status === 200) {
        setFiles(response.data);
        setAllFiles(response.data);
        allFilesRef.current = response.data;
      }
    } catch (error) { toast.error(`Error fetching files: ${error.message}`); }
  };

  // 🤖 AI Feature: Smart File Search — calls backend semantic search endpoint
  const handleSearch = async (query) => {
    if (!query || !query.trim()) {
      // Use the ref (always current) instead of the `allFiles` state, which the
      // debounce effect below would otherwise capture as a stale closure.
      setFiles(allFilesRef.current);
      setHasSearched(false);
      return;
    }
    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await axiosInstance.get(apiEndPoints.SEARCH_FILES(query));
      setFiles(response.data);
    } catch (error) {
      toast.error('Search failed, please try again');
    } finally {
      setIsSearching(false);
    }
  };

  // 🤖 AI Feature: debounce so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setFiles(allFilesRef.current);
    setHasSearched(false);
  };

  // Listens to the global upload context: when a background upload finishes
  // (status becomes 'done'), refresh the file list so the new file shows up
  // even if the user uploaded it while on a different page.
  const { uploadJobs } = useContext(UploadContext);
  useEffect(() => {
    if (uploadJobs.some(job => job.status === 'done')) {
      fetchFiles();
    }
  }, [uploadJobs]);

  const togglePublic = async (fileToUpdate) => {
    try {
            await axiosInstance.patch(apiEndPoints.TOGGLE_FILE(fileToUpdate.id), {});
      setFiles(prev => prev.map(f => f.id === fileToUpdate.id ? { ...f, isPublic: !f.isPublic } : f));
      setAllFiles(prev => prev.map(f => f.id === fileToUpdate.id ? { ...f, isPublic: !f.isPublic } : f));
    } catch (error) { toast.error('Error toggling file status'); }
  };

  const handleDownload = async (file) => {
    try {
            const response = await axiosInstance.get(apiEndPoints.DOWNLOAD_FILE(file.id), { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url; link.setAttribute("download", file.name); document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url);
    } catch (error) { toast.error('Error downloading file'); }
  };

  const openShareModal = (fileId) => setShareModal({ isOpen: true, fileId, link: apiEndPoints.PUBLIC_VIEW_LINK(fileId) });

  const handleDelete = async () => {
    const fileId = deleteConfirmation.fileId;
    if (!fileId) return;
    try {
            const response = await axiosInstance.delete(apiEndPoints.DELETE_FILE(fileId));
      if (response.status === 200 || response.status === 204) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        setAllFiles(prev => prev.filter(f => f.id !== fileId));
        toast.success("File deleted");
        setDeleteConfirmation({ isOpen: false, fileId: null });
      }
    } catch (error) { toast.error(error.message || "Error deleting file"); }
  };

  useEffect(() => { fetchFiles(); }, []);

  const getFileIcon = (file) => {
    const ext = file?.name?.split('.')?.pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return <Image size={16} color='#9d7fff' />;
    if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) return <Video size={16} color='#60a5fa' />;
    if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext)) return <Music size={16} color='#22c55e' />;
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) return <FileText size={16} color='#60a5fa' />;
    return <FileIcon size={16} color='#888' />;
  };

  const btnStyle = (color) => ({ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '8px', transition: 'all 0.2s' })

  return (
    <DashboardLayout activeMenu="My Files">
      <div style={{ padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>My Files</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              {hasSearched ? `${files.length} result${files.length !== 1 ? 's' : ''} for "${searchQuery}"` : `${files.length} file${files.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '4px' }}>
            {[['list', List], ['grid', Grid]].map(([mode, Icon]) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                style={{ padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: viewMode === mode ? 'var(--accent)' : 'transparent', color: viewMode === mode ? '#fff' : 'var(--text-muted)' }}>
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* 🤖 AI Feature: Smart File Search (semantic search) */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <Search size={17} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files by meaning, not just filename... e.g. 'invoice from june'"
            style={{
              width: '100%', padding: '13px 44px', borderRadius: '12px',
              border: '1px solid var(--border)', background: 'var(--bg-card)',
              color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
          />
          {isSearching ? (
            <Sparkles size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-bright)' }} className="animate-pulse" />
          ) : searchQuery ? (
            <button onClick={clearSearch} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex' }}>
              <X size={16} />
            </button>
          ) : null}
        </div>

        {files.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '80px 40px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <File size={28} color='var(--accent-bright)' />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{hasSearched ? 'No matching files' : 'No files yet'}</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 28px', lineHeight: 1.7 }}>
              {hasSearched ? `Nothing matched "${searchQuery}". Try a different phrase or check the spelling.` : 'Upload your first file to get started. Supports documents, images, and more.'}
            </p>
            {hasSearched ? (
              <button onClick={clearSearch} style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 28px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>Clear Search</button>
            ) : (
              <button onClick={() => navigate('/upload')} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 28px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>Upload Files</button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {files.map(file => <FileCard key={file.id} file={file} onDelete={() => setDeleteConfirmation({ isOpen: true, fileId: file.id })} onTogglePublic={togglePublic} onDownload={handleDownload} onShareLink={openShareModal} />)}
          </div>
        ) : (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-elevated)' }}>
                  {['Name', 'Size', 'Uploaded', 'Sharing', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id} style={{ borderTop: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{ marginTop: '2px' }}>{getFileIcon(file)}</div>
                        <div style={{ maxWidth: '320px' }}>
                          <div style={{ fontSize: '14px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                          {/* 🤖 AI Feature: Auto File Summarization preview */}
                          {file.aiStatus === 'PENDING' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              <Sparkles size={10} /> Summarizing...
                            </div>
                          )}
                          {file.summary && (
                            <div title={file.summary} style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {file.summary}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{(file.size / 1024).toFixed(1)} KB</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{new Date(file.uploadedAt).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => togglePublic(file)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: 'none', borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', background: file.isPublic ? 'var(--green-dim)' : 'var(--bg-elevated)', color: file.isPublic ? 'var(--green)' : 'var(--text-muted)' }}>
                          {file.isPublic ? <><Globe size={13} />Public</> : <><Lock size={13} />Private</>}
                        </button>
                        {file.isPublic && (
                          <button onClick={() => openShareModal(file.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', border: 'none', borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', background: 'var(--accent-dim)', color: 'var(--accent-bright)' }}>
                            <Copy size={12} /> Share
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button onClick={() => handleDownload(file)} title="Download"
                          style={{ padding: '7px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = '#60a5fa'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                          <Download size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirmation({ isOpen: true, fileId: file.id })} title="Delete"
                          style={{ padding: '7px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-dim)'; e.currentTarget.style.color = 'var(--red)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                          <Trash2 size={16} />
                        </button>
                        {file.isPublic && (
                          <a href={apiEndPoints.PUBLIC_VIEW_LINK(file.id)} target="_blank" rel="noreferrer"
                            style={{ padding: '7px', borderRadius: '8px', display: 'flex', color: 'var(--text-muted)', transition: 'all 0.2s', textDecoration: 'none' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = '#60a5fa'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                            <Eye size={16} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmationDialog isOpen={deleteConfirmation.isOpen} onClose={() => setDeleteConfirmation({ isOpen: false, fileId: null })} onConfirm={handleDelete} title="Delete File" message="Are you sure you want to delete this file? This action cannot be undone." confirmText="Delete" cancelText="Cancel" confirmationButtonClass="bg-red-600 hover:bg-red-700" />
        <LinkShareModal isOpen={shareModal.isOpen} onClose={() => setShareModal({ isOpen: false, fileId: null, link: "" })} link={shareModal.link} fileId={shareModal.fileId} />
      </div>
    </DashboardLayout>
  );
}

export default MyFiles;
