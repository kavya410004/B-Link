import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element, ...rest }) => {
    const { user } = useAuth();

    return (
        <Route path="/bloodbank/dashboard" element={<ProtectedRoute element={<BloodBankHome />} />} />
    );
};

export default ProtectedRoute;
