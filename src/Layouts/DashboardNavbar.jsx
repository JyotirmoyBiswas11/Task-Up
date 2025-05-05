import React from "react";
import { NavLink } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { app, auth, firestore } from "../../firebase";

function DashboardNavbar() {
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth)
      .then((res) => {
        console.log(res, "signed out");
        navigate("/");
      })
      .catch((err) => {
        console.log(err, "error signing out");
      });
  };
  const navigateToAccount=()=>{
    navigate("/account")
  }
  return (
    <div className="w-full bg-blue-950 px-5 py-5 flex text-white">
      <span className="font-semibold text-2xl hover:cursor-pointer" onClick={()=>navigate("/home")}>Task Up</span>
      <div className="grow"></div>
      <span className="mx-5 hover:cursor-pointer" onClick={()=>navigate("/about-us")}>About Us</span>
      <span className="mx-5 hover:cursor-pointer" onClick={navigateToAccount}>Account</span>
      <NavLink className="mx-5 font-semibold" onClick={handleSignOut}>SIGN OUT</NavLink>
    </div>
  );
}

export default DashboardNavbar;
