import React, { useState } from 'react';
import { signin, authenticate, isAuthenticated } from '../Api/Auth'; // Import the signin, authenticate, and isAuthenticated functions
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS
import { Navigate } from 'react-router-dom'; // Import Navigate for redirection

const Signin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);

  // Get authenticated user info
  const { user } = isAuthenticated();

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make API call to signin
    const result = await signin(formData);

    if (result.error) {
      const errorMessage = result.error.errors?.message || 'Invalid credentials.';
      setError(errorMessage);
      setSuccess(false);
    } else {
      setError('');
      setSuccess(true);

      // Store user data in localStorage using the authenticate function
      authenticate(result, () => {
        setRedirect(true); // Set redirect to true after successful authentication
      });

      // Show success toast message
      toast.success('Signin successful!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // Handle redirection based on authentication status
  const performRedirect = () => {
    if (redirect) {
      // Redirect based on user role
      if (user && user.role === 1) {
        return <Navigate to="/" />;
      } else {
        return <Navigate to="/" />;
      }
    }

    if (isAuthenticated()) {
      return <Navigate to="/" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        {/* Display error message if present */}
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Sign In
          </button>
        </form>

        {/* Perform redirection based on user authentication */}
        {performRedirect()}
      </div>

      {/* ToastContainer for displaying toasts */}
      <ToastContainer />
    </div>
  );
};

export default Signin;
