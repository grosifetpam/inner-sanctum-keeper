import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SystemProvider, useSystem } from "@/contexts/SystemContext";
import PublicLayout from "@/components/PublicLayout";
import AdminLayout from "@/components/AdminLayout";

import Index from "./pages/Index";
import SystemPage from "./pages/SystemPage";
import AltersPage from "./pages/AltersPage";
import JournalPage from "./pages/JournalPage";
import InnerWorldPage from "./pages/InnerWorldPage";
import CitationsPage from "./pages/CitationsPage";
import ResourcesPage from "./pages/ResourcesPage";
import TimelinePage from "./pages/TimelinePage";
import LexiconPage from "./pages/LexiconPage";
import CartographyPage from "./pages/CartographyPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageAlters from "./pages/admin/ManageAlters";
import ManageJournal from "./pages/admin/ManageJournal";
import ManageCitations from "./pages/admin/ManageCitations";
import ManageResources from "./pages/admin/ManageResources";
import ManageInnerWorld from "./pages/admin/ManageInnerWorld";
import ManageTimeline from "./pages/admin/ManageTimeline";
import ManageMood from "./pages/admin/ManageMood";
import ManageFront from "./pages/admin/ManageFront";
import ManageRelations from "./pages/admin/ManageRelations";
import ManageSystem from "./pages/admin/ManageSystem";
import ManageCartography from "./pages/admin/ManageCartography";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSystem();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Chargement...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function LoginRoute() {
  const { isAuthenticated, isLoading } = useSystem();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Chargement...</div>;
  if (isAuthenticated) return <Navigate to="/admin" replace />;
  return <LoginPage />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
        <Route path="/systeme" element={<PublicRoute><SystemPage /></PublicRoute>} />
        <Route path="/alters" element={<PublicRoute><AltersPage /></PublicRoute>} />
        <Route path="/journal" element={<PublicRoute><JournalPage /></PublicRoute>} />
        <Route path="/monde-interieur" element={<PublicRoute><InnerWorldPage /></PublicRoute>} />
        <Route path="/citations" element={<PublicRoute><CitationsPage /></PublicRoute>} />
        <Route path="/ressources" element={<PublicRoute><ResourcesPage /></PublicRoute>} />
        <Route path="/lexique" element={<PublicRoute><LexiconPage /></PublicRoute>} />
        <Route path="/chronologie" element={<PublicRoute><TimelinePage /></PublicRoute>} />
        <Route path="/cartographie" element={<PublicRoute><CartographyPage /></PublicRoute>} />

        {/* Auth */}
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/alters" element={<ProtectedRoute><ManageAlters /></ProtectedRoute>} />
        <Route path="/admin/journal" element={<ProtectedRoute><ManageJournal /></ProtectedRoute>} />
        <Route path="/admin/citations" element={<ProtectedRoute><ManageCitations /></ProtectedRoute>} />
        <Route path="/admin/ressources" element={<ProtectedRoute><ManageResources /></ProtectedRoute>} />
        <Route path="/admin/monde" element={<ProtectedRoute><ManageInnerWorld /></ProtectedRoute>} />
        <Route path="/admin/chronologie" element={<ProtectedRoute><ManageTimeline /></ProtectedRoute>} />
        <Route path="/admin/humeur" element={<ProtectedRoute><ManageMood /></ProtectedRoute>} />
        <Route path="/admin/front" element={<ProtectedRoute><ManageFront /></ProtectedRoute>} />
        <Route path="/admin/relations" element={<ProtectedRoute><ManageRelations /></ProtectedRoute>} />
        <Route path="/admin/systeme" element={<ProtectedRoute><ManageSystem /></ProtectedRoute>} />
        <Route path="/admin/cartographie" element={<ProtectedRoute><ManageCartography /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SystemProvider>
        <AppRoutes />
      </SystemProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
