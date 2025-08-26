
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({template,children}) => {
  if(template === 1){
    return <Navigate to="/" replace />
  }
 
  return children ? children : <Outlet/>
}

export default ProtectedRoute
