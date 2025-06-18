import { useState, type ChangeEvent } from 'react';

interface FieldsType {
  [key: string | symbol]: string;
}

interface FormValues {
  data: FieldsType;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setErrors: (errors: Record<string, string>) => void;
}

export function useFormFields(initialState: FieldsType): FormValues {
  const [data, SetData] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
