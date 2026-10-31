import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AuthLayout from '@/layouts/AuthLayout'
import StudentLayout from '@/layouts/StudentLayout'
import AdminLayout from '@/layouts/AdminLayout'
import NotFound from '@/pages/NotFound'

import PublicHome from '@/pages/public/Home'
import PublicAbout from '@/pages/public/About'
import PublicFeatures from '@/pages/public/Features'
import PublicCourses from '@/pages/public/Courses'
import PublicExams from '@/pages/public/Exams'
import PublicPricing from '@/pages/public/Pricing'
import PublicFaq from '@/pages/public/Faq'
import PublicContact from '@/pages/public/Contact'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import ResetPassword from '@/pages/auth/ResetPassword'
import VerifyEmail from '@/pages/auth/VerifyEmail'
import StudentOverview from '@/pages/student/Overview'
import StudentCourses from '@/pages/student/Courses'
import StudentCourseDetail from '@/pages/student/CourseDetail'
import StudentExams from '@/pages/student/Exams'
import StudentExamDetail from '@/pages/student/ExamDetail'
import StudentExamAttempt from '@/pages/student/ExamAttempt'
import StudentResults from '@/pages/student/Results'
import StudentResultDetail from '@/pages/student/ResultDetail'
import StudentStats from '@/pages/student/Stats'
import StudentActivity from '@/pages/student/Activity'
import StudentSettings from '@/pages/student/Settings'
import StudentUpgrade from '@/pages/student/Upgrade'
import AdminOverview from '@/pages/admin/Overview'
import AdminUsers from '@/pages/admin/Users'
import AdminCourses from '@/pages/admin/Courses'
import AdminCategories from '@/pages/admin/Categories'
import AdminExams from '@/pages/admin/Exams'
import AdminQuestions from '@/pages/admin/Questions'
import AdminTransactions from '@/pages/admin/Transactions'
import AdminReports from '@/pages/admin/Reports'
import AdminSettings from '@/pages/admin/Settings'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <PublicHome /> },
      { path: '/about', element: <PublicAbout /> },
      { path: '/features', element: <PublicFeatures /> },
      { path: '/courses', element: <PublicCourses /> },
      { path: '/exams', element: <PublicExams /> },
      { path: '/pricing', element: <PublicPricing /> },
      { path: '/faq', element: <PublicFaq /> },
      { path: '/contact', element: <PublicContact /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/verify-email', element: <VerifyEmail /> },
    ],
  },
  {
    path: '/dashboard',
    element: <StudentLayout />,
    children: [
      { index: true, element: <StudentOverview /> },
      { path: 'courses', element: <StudentCourses /> },
      { path: 'courses/:courseId', element: <StudentCourseDetail /> },
      { path: 'exams', element: <StudentExams /> },
      { path: 'exams/:examId', element: <StudentExamDetail /> },
      { path: 'exams/:examId/attempt', element: <StudentExamAttempt /> },
      { path: 'results', element: <StudentResults /> },
      { path: 'results/:resultId', element: <StudentResultDetail /> },
      { path: 'stats', element: <StudentStats /> },
      { path: 'activity', element: <StudentActivity /> },
      { path: 'settings', element: <StudentSettings /> },
      { path: 'upgrade', element: <StudentUpgrade /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminOverview /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'courses', element: <AdminCourses /> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'exams', element: <AdminExams /> },
      { path: 'questions', element: <AdminQuestions /> },
      { path: 'transactions', element: <AdminTransactions /> },
      { path: 'reports', element: <AdminReports /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])
