import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotFound from "../NotFound";

const RoleBseRoute = (props) => {
    const isAdminRoute = window.location.pathname.startsWith("/admin");
    const user = useSelector(state => state.account.user);
    const userRole = user.role;
    console.log('role',userRole);

    if(isAdminRoute && userRole === 'ADMIN') {
        return (<>{props.children}</>)
    }else {
        return (<NotFound />)
    }
}

const ProtectedRoute = (props)=> {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated)

    return <>
        {isAuthenticated === true ? 
         <RoleBseRoute>
            {props.children}
        </RoleBseRoute> 
        : 
        <Navigate to='/login' replace /> 
        }  
    </>;
}

export default ProtectedRoute;