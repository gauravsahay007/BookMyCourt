import React, { useEffect, useState } from 'react';
import { useData } from '../Context/DataProvider';
import { Outlet, Link } from 'react-router-dom';

const NavbarLayout = () => {
  const user = JSON.parse(localStorage.getItem("jwt"))?.user;
  const userRole = user ? user.role : null; // Get the user's role
  
  const { state, setState } = useData(); // Use DataProvider context
  const [centreId, setCentreId] = useState(state?.centreId); // Local state for centreId

  // Update `centreId` whenever `state` changes
  useEffect(() => {
    setCentreId(state?.centreId); // Set local state from context state
  }, [state?.centreId]);

  console.log(state);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">NEXUS</h1>
        <nav className="mt-4">
          <ul>
            <li className="py-2 hover:bg-gray-700 px-2 rounded">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="py-2 hover:bg-gray-700 px-2 rounded">
              <Link to="/schedule">Schedule</Link>
            </li>
            <li className="py-2 hover:bg-gray-700 px-2 rounded">
              <Link to="/customers">Customers</Link>
            </li>

            {/* Conditional Rendering Based on User Role and Centre ID */}
            {centreId ? (
              <>
                {userRole === 1 && ( // Operations team member
                  <>
                    <li className="py-2 hover:bg-gray-700 px-2 rounded">
                      <Link to="/manage-centre">Manage Centre</Link>
                    </li>
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
                    <Link to="/book-court">Book a Court</Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        <Outlet /> {/* Render child route components */}
      </main>
    </div>
  );
};

export default NavbarLayout;
