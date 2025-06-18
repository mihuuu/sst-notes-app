import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'User name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    console.log(formData, newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // TODO: Implement signup logic
      console.log('Signup attempt:', formData);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 flex flex-col items-center">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
        <fieldset className="fieldset w-sm text-sm">
          <label className="label mt-2 text-gray-600">User name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="input w-full"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name ? <p className="text-error">{errors.name}</p> : null}

          <label className="label mt-2 text-gray-600">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="input w-full"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email ? <p className="text-error">{errors.email}</p> : null}

          <label className="label mt-2 text-gray-600">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="input w-full"
            required
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password ? <p className="text-error">{errors.password}</p> : null}

          <label htmlFor="confirmPassword" className="label mt-2 text-gray-600">
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
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword ? <p className="text-error">{errors.confirmPassword}</p> : null}

          <button type="submit" className="btn btn-primary mt-6" onClick={handleSubmit}>
            Create account
          </button>
        </fieldset>
      </div>
    </div>
  );
}
