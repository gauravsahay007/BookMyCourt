import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarLayout from './Components/Navbar';
import Schedule from './Components/Schedule';
import UserSchedule from './Components/UserSchedule'; // Import UserSchedule component
import ManageCourts from './Components/ManageCourts';
import Signin from './Components/Signin';
import Signup from './Components/Signup';
import RegisterCentre from './Components/RegisterCentre';
import { getUserRegisteredCentre } from './Api/user';
import { useData } from './Context/DataProvider';
import ManageSports from './Components/ManageSport';
import ManageCentre from './Components/ManageCentre';
import CreateBooking from './Components/CreateBooking';
import ManageBookings from './Components/ManageBooking';

function App() {
  const { state, setState } = useData();

  // Use an async function inside useEffect properly
  useEffect(() => {
    const fetchRegisteredCentre = async () => {
      const userId = JSON.parse(localStorage.getItem('jwt'))?.user?._id;
      const userRole = JSON.parse(localStorage.getItem('jwt'))?.user?.role;

      if (userId) {
        try {
          const resp = await getUserRegisteredCentre(userId);
          console.log(resp);

          if (resp.registeredCentre) {
            setState((prevState) => ({
              ...prevState,
              centreId: resp.registeredCentre._id,
              userRole: userRole, // Store the user role in the state
            }));
            // Store the centreId and role in localStorage
            localStorage.setItem('centreId', resp.registeredCentre._id);
            localStorage.setItem('userRole', userRole);
          }
        } catch (error) {
          console.error('Failed to fetch registered centre:', error);
        }
      }
    };

    fetchRegisteredCentre();
  }, [state.centreId, setState]); // Add setState to dependencies

  useEffect(() => {
    const fetchRegisteredCentre = async () => {
      const userId = JSON.parse(localStorage.getItem('jwt'))?.user?._id;
      const userRole = JSON.parse(localStorage.getItem('jwt'))?.user?.role;

      if (userId) {
        try {
          const resp = await getUserRegisteredCentre(userId);
          console.log(resp);

          if (resp.registeredCentre) {
            setState((prevState) => ({
              ...prevState,
              centreId: resp.registeredCentre._id,
              userRole: userRole, // Store the user role in the state
            }));
            // Store the centreId and role in localStorage
            localStorage.setItem('centreId', resp.registeredCentre._id);
            localStorage.setItem('userRole', userRole);
          }
        } catch (error) {
          console.error('Failed to fetch registered centre:', error);
        }
      }
    };

    fetchRegisteredCentre();
  }, []);
  const userRole = JSON.parse(localStorage.getItem('jwt'))?.user?.role;

  return (
    <Router>
      <Routes>
        <Route path="signin" element={<Signin />} />
        <Route path="signup" element={<Signup />} />

        {/* Dashboard layout will be persistent */}
        <Route path="/" element={<NavbarLayout />}>
          {/* Conditional rendering of the schedule based on the user's role */}
          <Route
            path=""
            element={userRole === 0 ? <UserSchedule /> : <Schedule />}
          />
          <Route path="manage-courts" element={<ManageCourts />} />
          <Route path="register-centre" element={<RegisterCentre />} />
          <Route path="manage-sports" element={<ManageSports />} />
          <Route path="manage-centre" element={<ManageCentre />} />
          <Route path="create-bookings" element={<CreateBooking />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
