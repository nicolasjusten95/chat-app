import React from 'react';
import {Route, Routes} from "react-router-dom";
import Homepage from "./components/Homepage";
import SignIn from "./components/register/SignIn";
import SignUp from "./components/register/SignUp";
import Profile from "./components/profile/Profile";
import Status from "./components/status/Status";
import StatusViewer from "./components/status/StatusViewer";

function App() {
  return (
    <div>
      <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/status" element={<Status />} />
          <Route path="/status/:userId" element={<StatusViewer />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
