import { HashRouter, Route, Routes, Navigate } from "react-router";

import RootLayout from "./app/layout";
import Layout from "./app/(main)/layout";

import { ProtectedRoute } from "./components/protected-route";
import Dashboard from "./app/(main)/dashboard/page";
import LDPlayer from "./app/(main)/ldplayer/page";
import CreateLDPlayer from "./app/(main)/create-ldplayer/page";
import FileManager from "./app/(main)/file-manager/page";
import ProFile from "./app/(main)/profile/page";
import Setting from "./app/(main)/setting/page";
import Login from "./app/login/page";
import Account from "./app/(main)/account/page";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<RootLayout />}>
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="ldplayer" element={<LDPlayer />} />
            <Route path="create-ldplayer" element={<CreateLDPlayer />} />
            <Route path="file" element={<FileManager />} />
            <Route path="profile" element={<ProFile />} />
            <Route path="setting" element={<Setting />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Route>

        {/* Catch all: redirect unknown routes to /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
