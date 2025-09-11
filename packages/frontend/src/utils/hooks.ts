import { useState } from 'react';

interface FieldsType {
  [key: string | symbol]: string;
}

interface FormValues {
  data: FieldsType;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setErrors: (errors: Record<string, string>) => void;
}

export function useFormFields(initialState: FieldsType): FormValues {
  const [data, SetData] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    SetData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return { data, errors, handleChange, setErrors };
}

interface LoadingState {
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export function useLoadingState(initialLoading = false): LoadingState {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  return {
    loading,
    error,
    setLoading,
    setError,
    clearError,
  };
}
