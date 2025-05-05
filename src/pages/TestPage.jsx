import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Card,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/nauth");
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navList = (
    <ul className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
    
      <li>
        <Typography
          as="a"
          href="#"
          variant="small"
          color="blue-gray"
          className="p-1 font-medium text-gray-700 hover:text-blue-500 transition-colors"
        >
          About Us
        </Typography>
      </li>
    </ul>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar className="sticky top-0 z-10 max-w-full px-4 py-4 bg-white bg-opacity-80 shadow-md">
        <div className="flex items-center justify-between text-gray-900">
          <Typography
            as="a"
            href="#"
            className="mr-4 cursor-pointer text-2xl font-bold text-blue-600"
          >
            TaskUp
          </Typography>
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navList}
            <Button
              variant="gradient"
              size="sm"
              className="text-white bg-blue-500 hover:bg-blue-600 transition-colors"
              onClick={handleSignIn}
            >
              <span>Sign In</span>
            </Button>
          </div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-6 w-6"
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
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-6 w-6"
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
        <Collapse open={openNav}>
          {navList}
          <div className="flex flex-col gap-4 mt-4">
           
            <Button
              fullWidth
              variant="gradient"
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </div>
        </Collapse>
      </Navbar>

      <Card className="flex-grow bg-blue-50 py-16">
        <div className="flex justify-center">
          <img
            src="https://static.wixstatic.com/media/de2c62_2144268965ee48aa8ee49899791cf4a1~mv2.jpg"
            className="h-96 w-auto object-cover rounded-lg shadow-lg"
            alt="TaskUp Main"
          />
        </div>
        <div className="text-center mt-12">
          <Typography variant="h3" className="text-blue-700 font-bold mt-32">
            Welcome
          </Typography>
        </div>
      </Card>

      <footer className="bg-gray-700 text-white py-8 text-center">
        <Typography variant="h2" color="white" className="mb-4">
          What is Task Up?
        </Typography>
        <Typography color="white" className="font-normal">
          Task Up is a custom task management website that helps manage and track your work.
        </Typography>
      </footer>
    </div>
  );
}
