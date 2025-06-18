import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from 'aws-amplify/auth';
import { useAuth } from '../contexts/AuthContext';
import { useFormFields } from '../utils/hooks';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, setIsAuthenticated } = useAuth();
  const { data, errors, handleChange, setErrors } = useFormFields({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!data.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', data);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { isSignedIn, nextStep } = await signIn({
        username: data.email,
        password: data.password,
      });

      console.log('Sign in result:', { isSignedIn, nextStep });

      if (isSignedIn) {
        // Refresh auth state to ensure context is updated
        setIsAuthenticated(true);
        // Redirect to home page after successful login
        navigate('/');
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        // User needs to confirm their email
        setErrors({
          general: 'Please check your email and confirm your account before signing in.',
        });
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        // User needs to set a new password
        setErrors({ general: 'Please set a new password to continue.' });
      } else {
        setErrors({ general: 'Sign in failed. Please check your credentials and try again.' });
      }
    } catch (error) {
      console.error('Sign in error:', error);

      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === 'NotAuthorizedException') {
          setErrors({ general: 'Invalid email or password.' });
        } else if (error.name === 'UserNotConfirmedException') {
          setErrors({
            general: 'Please check your email and confirm your account before signing in.',
          });
        } else if (error.name === 'UserNotFoundException') {
          setErrors({
            general: 'User not found. Please check your email or sign up for a new account.',
          });
        } else {
          setErrors({
            general: error.message || 'An unexpected error occurred. Please try again.',
          });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 flex flex-col items-center">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>

        {errors.general && (
          <div className="alert alert-error">
            <span>{errors.general}</span>
          </div>
        )}

        <fieldset className="fieldset w-sm text-sm">
          <label className="label mt-2 text-gray-600">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="input w-full"
            placeholder="Enter your email"
            value={data.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email ? <p className="text-error">{errors.email}</p> : null}

          <label className="label mt-2 text-gray-600">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="input w-full"
            placeholder="Enter your password"
            value={data.password}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.password ? <p className="text-error">{errors.password}</p> : null}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            {/* <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div> */}
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-6 w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </fieldset>
      </div>
    </div>
  );
}
