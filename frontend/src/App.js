import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarLayout from './Components/Navbar';
import Schedule from './Components/Schedule';
import ManageCourts from './Components/ManageCourts';
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import RegisterCentre from './Components/RegisterCentre';
import { getUserRegisteredCentre } from './Api/user';
import { useData } from './Context/DataProvider';

function App() {
  const { state, setState } = useData();

  // Use an async function inside useEffect properly
  useEffect(() => {
    const fetchRegisteredCentre = async () => {
      const userId = JSON.parse(localStorage.getItem("jwt"))?.user?._id;
      if (userId) {
        try {
          const resp = await getUserRegisteredCentre(userId);
          // console.log(resp);
         if(resp.registeredCentre) setState((prevState) => ({
            ...prevState, 
            centreId: resp?.registeredCentre?._id 
          }));
          // console.log(userId);
        } catch (error) {
          console.error("Failed to fetch registered centre:", error);
        }
      }
    };
    
    fetchRegisteredCentre();
}, [state.centreId]); // Add setState as a dependency

  return (
    <Router>
      <Routes>
        <Route path="signin" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        
        {/* Dashboard layout will be persistent */}
        <Route path="/" element={<NavbarLayout />}>
          {/* Nested routes rendered inside the layout's <Outlet> */}
          <Route path="schedule" element={<Schedule />} />
          <Route path="manage-courts" element={<ManageCourts />} />
          <Route path="register-centre" element={<RegisterCentre />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
