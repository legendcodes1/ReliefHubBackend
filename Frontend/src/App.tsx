import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute'
import { AuthPage } from './features/auth/AuthPage'
import { AccountPage } from './pages/AccountPage'
import { ExerciseDetailPage } from './pages/ExerciseDetailPage'
import { HomePage } from './pages/HomePage'
import RoutinePage from './pages/RoutinePage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { SavedExercisesPage } from './pages/SavedExercisesPage'
import { MyRoutinesPage } from './pages/MyRoutinesPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <AuthPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <AuthPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RecommendationsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ExerciseDetailPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SavedExercisesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
        <Route
        path="/routines"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RoutinePage/>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-routines"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyRoutinesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AccountPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default App
