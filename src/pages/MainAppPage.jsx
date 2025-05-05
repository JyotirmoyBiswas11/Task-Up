import React, { useEffect, useState } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Card,
  progress,
} from "@material-tailwind/react";
import { Navigate, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { app, auth, firestore } from "../../firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export function LandindPage() {
  const db = firestore;
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth)
      .then((res) => {
        console.log(res, "signed out");
        <Navigate to="/" />;
      })
      .catch((err) => {
        console.log(err, "error signing out");
      });
  };

  const [openNav, setOpenNav] = React.useState(false);
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 lg:w-full">
      <Typography
        as="li" 
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a  className="flex items-center text-black hover:cursor-pointer " onClick={()=>navigate("/about-us")}>
          About Us
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a  className="flex items-center text-black hover:cursor-pointer " onClick={()=>navigate("/account")}>
          Account
        </a>
      </Typography>
    </ul>
  );

  return (
    <div className="-m-6  bg-gray-800 absolute left-5 w-full ">
      <Navbar className="sticky top-0 z-10 h-max w-full rounded-none  py-3 lg:px-8 right-0 lg:py-4 lg:w-full">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href="#"
            className="mr-4 cursor-pointer py-1.5 font-medium text-black "
            onClick={()=>navigate("/home")}
          >
            Task Up
          </Typography>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
            <div className="flex items-center gap-x-1">
              <Button
                variant="gradient"
                size="sm"
                className="hidden lg:inline-block text-black"
                onClick={handleSignOut}
              >
                <span>Sign out</span>
              </Button>
            </div>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
              
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
      </Navbar>
      
        <Card className=" overflow-y-auto  w-screen ">
          <div className=" flex items-center w-screen ">
         
          </div>
        </Card>
        <Typography variant="h2" color="blue-gray" className="mb-2 text-white mt-5 ml-96 justify-center items-center">
          What is Task Up?
        </Typography>
        <Typography color="gray" className="font-normal text-white mb-12 ml-96">
          Task Up is a custom task management website which is helpful in
          managing and tracking your work.
        </Typography>
      
    </div>
  );
}
