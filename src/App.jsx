import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import MyFiles from './pages/MyFiles'
import Transation from './pages/Transation'
import Subscription from './pages/Subscription'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ProtectedRoute from './component/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
import { UserCreditsProvider } from './context/UserCreditsContext'
import { UploadProvider } from './context/UploadContext'
import GlobalUploadToast from './component/GlobalUploadToast'
import PublicFileView from './pages/PublicFileView'

const App = () => {
  return (

    <UserCreditsProvider>
      <UploadProvider>
        <BrowserRouter>

          <Toaster />
          <GlobalUploadToast />

          <Routes>

            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="file/:fileId" element={<PublicFileView />} />

            {/* Protected routes — require a valid JWT (see ProtectedRoute) */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute><Upload /></ProtectedRoute>
            } />
            <Route path="/my-files" element={
              <ProtectedRoute><MyFiles /></ProtectedRoute>
            } />
            <Route path="/subscription" element={
              <ProtectedRoute><Subscription /></ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute><Transation /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />

            {/* Unknown routes fall back to the landing page */}
            <Route path="/*" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </UploadProvider>
    </UserCreditsProvider>
  )
}

export default App
