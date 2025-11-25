import { useSelector, useDispatch } from 'react-redux'
import { useMemo } from 'react'

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading } = useSelector((state) => state.auth)
  
  return useMemo(() => ({
    user,
    token,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role?.name === 'Admin',
    isDoctor: user?.role?.name === 'Doctor',
    isStaff: user?.role?.name === 'Staff',
    isPatient: user?.role?.name === 'Patient'
  }), [user, token, isAuthenticated, isLoading])
}