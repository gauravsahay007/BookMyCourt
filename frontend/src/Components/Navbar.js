import React, { useEffect, useState } from 'react';
import { useData } from '../Context/DataProvider';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { signout, isAuthenticated } from '../Api/Auth'; // Import signout and isAuthenticated

const NavbarLayout = () => {
  const [userRole, setUserRole] = useState(null); // Local state for user role
  const { state, setState } = useData(); // Use DataProvider context
  const [centreId, setCentreId] = useState(state?.centreId); // Local state for centreId

  const navigate = useNavigate(); // Use navigate hook for redirection

  // Get user from localStorage and set user role
  useEffect(() => {
    const jwt = JSON.parse(localStorage.getItem("jwt"));
    console.log('JWT:', jwt); // Debugging: Check JWT structure

    if (jwt && jwt.user) {
      setUserRole(jwt.user.role); // Set user role in local state
      console.log('User Role:', jwt.user.role); // Debugging: Check role value
    }
  }, []); // Run only on component mount

  // Update centreId whenever state changes
  useEffect(() => {
    setCentreId(state?.centreId);
  }, [state?.centreId]);

  console.log('State:', state); // Debugging: Check state

  // Handle signout
  const handleSignout = () => {
    signout(() => {
      navigate('/signin'); // Redirect to signin page after signout
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-4">BookMyCourt</h1>
        <nav className="mt-4">
          <ul>
            <li className="py-2 hover:bg-gray-700 px-2 rounded">
              <Link to="/">Dashboard</Link>
            </li>

            {/* Conditional Rendering Based on User Role and Centre ID */}
            {centreId ? (
              <>
                {userRole === 1 && ( // Operations team member
                  <>
                    <li
                    className="py-2 hover:bg-gray-700 px-2 rounded cursor-pointer"
                    onClick={() => navigate('/manage-centre')}
                  >Manage Bookings</li>
                    <li className="py-2 hover:bg-gray-700 px-2 rounded">
                      <Link to="/manage-sports">Manage Sports</Link>
                    </li>
                    <li className="py-2 hover:bg-gray-700 px-2 rounded">
                      <Link to="/manage-bookings">Manage Bookings</Link>
                    </li>
                  </>
                )}
              </>
            ) : (
              <>
                {userRole === 1 && ( // Operations team member
                  <li className="py-2 hover:bg-gray-700 px-2 rounded">
                    <Link to="/register-centre">Register Your Centre</Link>
                  </li>
                )}
                {userRole === 0 && ( // Normal user
                  <li className="py-2 hover:bg-gray-700 px-2 rounded">
                    <Link to="/create-bookings">Create Booking</Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>

        {/* Signout Option */}
        <div className="mt-auto">
          <button
            onClick={handleSignout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4"
          >
            Signout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        <Outlet /> {/* Render child route components */}
      </main>
    </div>
  );
};

export default NavbarLayout;
