import { useState } from 'react';
import { confirmSignUp } from 'aws-amplify/auth';
import { useFormFields } from '../utils/hooks';

interface EmailConfirmationProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function EmailConfirmation({ email, onSuccess, onBack }: EmailConfirmationProps) {
  const { data, errors, handleChange, setErrors } = useFormFields({
    confirmationCode: '',
  });

  const [isConfirming, setIsConfirming] = useState(false);

  const validateConfirmationCode = () => {
    const newErrors: Record<string, string> = {};

    if (!data.confirmationCode.trim()) {
      newErrors.confirmationCode = 'Confirmation code is required';
    } else if (data.confirmationCode.length < 6) {
      newErrors.confirmationCode = 'Confirmation code must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateConfirmationCode()) {
      return;
    }

    setIsConfirming(true);
    setErrors({});

    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: data.confirmationCode,
      });

      console.log('Confirmation result:', { isSignUpComplete });

      if (isSignUpComplete) {
        // User is now confirmed and can sign in
        setErrors({
          general: 'Account confirmed successfully! You can now sign in.',
        });
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error('Confirmation error:', error);

      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === 'CodeMismatchException') {
          setErrors({
            confirmationCode: 'Invalid confirmation code. Please check your email and try again.',
          });
        } else if (error.name === 'ExpiredCodeException') {
          setErrors({
            confirmationCode: 'Confirmation code has expired. Please request a new one.',
          });
        } else if (error.name === 'NotAuthorizedException') {
          setErrors({
            general: 'Account is already confirmed. Please sign in instead.',
          });
        } else {
          setErrors({
            confirmationCode: error.message || 'An unexpected error occurred. Please try again.',
          });
        }
      } else {
        setErrors({ confirmationCode: 'An unexpected error occurred. Please try again.' });
      }
    }
    setIsConfirming(false);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 flex flex-col items-center">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a confirmation code to <strong>{email}</strong>
        </p>

        {errors.general && (
          <div className="alert alert-info">
            <span>{errors.general}</span>
          </div>
        )}

        <fieldset className="fieldset w-sm text-sm">
          <label className="label mt-2 text-gray-600">Confirmation Code</label>
          <input
            id="confirmationCode"
            name="confirmationCode"
            type="text"
            required
            className="input w-full"
            placeholder="Enter the 6-digit code"
            value={data.confirmationCode}
            onChange={handleChange}
            disabled={isConfirming}
            maxLength={6}
          />
          {errors.confirmationCode ? <p className="text-error">{errors.confirmationCode}</p> : null}

          <button
            type="submit"
            className="btn btn-primary mt-6 w-full"
            onClick={handleConfirmSignUp}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>

          <button
            type="button"
            className="btn btn-outline mt-4 w-full"
            onClick={onBack}
            disabled={isConfirming}
          >
            Back to Sign Up
          </button>
        </fieldset>
      </div>
    </div>
  );
}
