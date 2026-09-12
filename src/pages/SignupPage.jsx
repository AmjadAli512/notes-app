import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/SignupForm';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/notes', { replace: true });
  }, [isAuthenticated, navigate]);

  return <SignupForm />;
};

export default SignupPage;