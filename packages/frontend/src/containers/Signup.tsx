import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from 'aws-amplify/auth';
import { useAuth } from '../contexts/AuthContext';
import { useFormFields } from '../utils/hooks';
import EmailConfirmation from '../components/EmailConfirmation';

export default function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, checkAuthState } = useAuth();
  const { data, errors, handleChange, setErrors } = useFormFields({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');

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
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render signup form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) {
      newErrors.name = 'User name is required';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!data.password) {
      newErrors.password = 'Password is required';
    } else if (data.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            name: data.name,
          },
          autoSignIn: true,
        },
      });

      console.log('Sign up result:', { isSignUpComplete, userId, nextStep });

      if (isSignUpComplete) {
        // User is automatically signed in
        checkAuthState();
        navigate('/');
      } else if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        // User needs to confirm their email
        setSignupEmail(data.email);
        setShowConfirmation(true);
        setErrors({
          general:
            'Account created successfully! Please check your email and enter the confirmation code below.',
        });
      } else {
        setErrors({ general: 'Sign up completed but requires additional steps.' });
      }
    } catch (error) {
      console.error('Sign up error:', error);

      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === 'UsernameExistsException') {
          setErrors({
            general: 'An account with this email already exists. Please sign in instead.',
          });
        } else if (error.name === 'InvalidPasswordException') {
          setErrors({
            general: 'Password does not meet requirements. Please choose a stronger password.',
          });
        } else if (error.name === 'InvalidParameterException') {
          setErrors({
            general: 'Invalid email format. Please enter a valid email address.',
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

  const handleConfirmationSuccess = () => {
    navigate('/login');
  };

  const handleBackToSignup = () => {
    setShowConfirmation(false);
    setSignupEmail('');
    setErrors({});
  };

  // Show confirmation step
  if (showConfirmation) {
    return (
      <EmailConfirmation
        email={signupEmail}
        onSuccess={handleConfirmationSuccess}
        onBack={handleBackToSignup}
      />
    );
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 flex flex-col items-center">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-base-900">
          Create your account
        </h2>

        {errors.general && (
          <div className="alert alert-error">
            <span>{errors.general}</span>
          </div>
        )}

        <fieldset className="fieldset w-sm text-sm">
          <label className="label mt-2">User name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="input w-full"
            placeholder="Enter your name"
            value={data.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.name ? <p className="text-error">{errors.name}</p> : null}

          <label className="label mt-2">Email address</label>
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

          <label className="label mt-2">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="input w-full"
            required
            placeholder="Create a password"
            value={data.password}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.password ? <p className="text-error">{errors.password}</p> : null}

          <label htmlFor="confirmPassword" className="label mt-2">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="input w-full"
            required
            placeholder="Confirm your password"
            value={data.confirmPassword}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.confirmPassword ? <p className="text-error">{errors.confirmPassword}</p> : null}

          <button
            type="submit"
            className="btn btn-primary mt-6 w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
          <p className="mt-4 text-center text-sm text-base-content/80">
            Or{'  '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
              sign in to your existing account
            </Link>
          </p>
        </fieldset>
      </div>
    </div>
  );
}
