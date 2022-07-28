import Login from './components/Login';
import Signup from './components/Signup';
import { RiderProfile } from './components/RiderProfile';
// import { DriverProfile } from './components/DriverProfile';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/" element={<Signup />} />
          <Route exact path="/driver/:id" element={<RiderProfile />} />
          <Route exact path="/rider/:id" element={<RiderProfile />} />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Sentry.withProfiler(App);
