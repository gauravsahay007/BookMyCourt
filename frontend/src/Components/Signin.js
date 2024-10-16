import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { signin, authenticate, isAuthenticated } from '../Api/Auth'; // Import functions from API
import { toast, ToastContainer } from 'react-toastify'; // Import toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

const Signin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

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
        // Redirect after successful authentication
        if (result.user.role === 1) {
          navigate('/'); // Redirect to admin dashboard if role is 1
        } else {
          navigate('/'); // Redirect to user dashboard if role is 0
        }

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
      });
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated()) {
    navigate('/'); // Redirect to dashboard if already logged in
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        {/* Display test credentials */}
        <div className="bg-yellow-100 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-700">
            <strong>Test Credentials:</strong>
          </p>
          <p className="text-sm text-gray-700">
            <strong>Operations Team Member:</strong> admin@test.com / iiita123
          </p>
          <p className="text-sm text-gray-700">
            <strong>Normal User:</strong> user@test.com / iiita123
          </p>
        </div>

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

        {/* Sign-up Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            New User?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* ToastContainer for displaying toasts */}
      <ToastContainer />
    </div>
  );
};

export default Signin;
