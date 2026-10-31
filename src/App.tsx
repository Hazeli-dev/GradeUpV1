import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import { ToastProvider } from '@/components/Toast'
import { AuthProvider } from '@/context/AuthContext' // <-- Ditambahkan di sini

export default function App() {
  return (
    // <-- AuthProvider membungkus semuanya di luar
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  )
}