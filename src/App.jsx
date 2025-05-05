import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandindPage } from "./pages/MainAppPage";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { ProtectedRoute } from "./components/protectedRoute";
import { StickyNavbar } from "./pages/TestPage";
import { NewAuth } from "./pages/Authentication";

import React from "react";
import UserDashboard from "./pages/UserDashboard";
import AccountPage from "./pages/Account";
import AboutUs from "./pages/AboutUs";

function App() {
  const [user, setUser] = useState(null);
  const [fetching, setIsFetching] = useState(true);

  useEffect(() => {
    if(!auth) return () => false;

    const unsbscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsFetching(false);
        return;
      }
      setUser(null);
      setIsFetching(false);
    });

    return () => unsbscribe();

  }, [auth]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<StickyNavbar user={user} />} />
          <Route path="/nauth" element={<NewAuth user={user} />} />
          <Route
            path="/home"
            element={<UserDashboard user={user} />}
          />
         <Route
         path="/account"
         element={<AccountPage user={user}/>} />

         <Route
         path="/about-us"
         element={<AboutUs/>} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;