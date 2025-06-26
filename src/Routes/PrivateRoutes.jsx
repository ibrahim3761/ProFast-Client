import React from 'react';
import useAuth from '../Hooks/useAuth.JSX';
import { Navigate } from 'react-router';

const PrivateRoutes = ({children}) => {

    const {user, loading} = useAuth();

    if( loading){
        <div className='flex justify-center items-center h-screen'>
            <span className="loading loading-spinner loading-xl"></span>
        </div>
    }
    if(!user){
        <Navigate to='/login' ></Navigate>
    }
    return children
};

export default PrivateRoutes;