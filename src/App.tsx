import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppLayout from './components/layout/AppLayout';
import { editorialTheme } from './theme/editorial';
import { AuthProvider } from './context/AuthContext';
import { ScriptProvider } from './context/ScriptContext';
import ScriptListPage from './pages/scripts/ScriptListPage';
import ScriptUploadPage from './pages/scripts/ScriptUploadPage';
import BasicInfoPage from './pages/scripts/BasicInfoPage';
import AnalyzePage from './pages/analysis/AnalyzePage';
import Module1Page from './pages/modules/Module1Page';
import Module2Page from './pages/modules/Module2Page';
import CycleSheetPage from './pages/modules/CycleSheetPage';

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={editorialTheme}>
      <AntApp>
        <AuthProvider>
          <ScriptProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
              <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Navigate to="/scripts" replace />} />
                <Route
                  path="/scripts"
                  element={
                    <AppLayout>
                      <ScriptListPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/scripts/upload"
                  element={
                    <AppLayout>
                      <ScriptUploadPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/scripts/:id/info"
                  element={
                    <AppLayout>
                      <BasicInfoPage />
                    </AppLayout>
                  }
                />
                {/* 旧路由兼容 */}
                <Route
                  path="/scripts/:id/parse-preview"
                  element={
                    <AppLayout>
                      <BasicInfoPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/scripts/:id/analyze"
                  element={
                    <AppLayout>
                      <AnalyzePage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/scripts/:id/module1"
                  element={
                    <AppLayout>
                      <Module1Page />
                    </AppLayout>
                  }
                />
                <Route
                  path="/scripts/:id/module2"
                  element={
                    <AppLayout>
                      <Module2Page />
                    </AppLayout>
                  }
                />
                <Route
                  path="/scripts/:id/cyclesheet"
                  element={
                    <AppLayout>
                      <CycleSheetPage />
                    </AppLayout>
                  }
                />
              </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </ScriptProvider>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
}
