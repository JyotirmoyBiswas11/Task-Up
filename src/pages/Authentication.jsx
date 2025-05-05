import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Navigate } from "react-router-dom";
import { app } from '../../firebase';
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firestore = getFirestore(app);

export const NewAuth = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [designation, setDesignation] = useState("");
  const [isSignUpActive, setSignUpActive] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const handleMethodChange = () => {
    setSignUpActive(!isSignUpActive);
  };

  const handleSignUp = async () => {
    if (!email || !password || !userName || !designation) {
      setErrMessage("Please fill all fields.");
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(firestore, "Users", user.uid), {
        userName: userName,
        email: email,
        designation: designation,
        UID: user.uid,
        role: "user",
      });

      console.log("User information saved:", user);
    } catch (err) {
      console.log(err);
      setErrMessage(`Error: ${err.message}`);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
    } catch (err) {
      console.log(err.code, err.message);
      setErrMessage(`Error: ${err.code}`);
    }
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleUserNameChange = (event) => setUserName(event.target.value);
  const handleDesignationChange = (event) => setDesignation(event.target.value);

  if (user) {
    return <Navigate to="/home" />;
  }

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="md:w-1/3 max-w-sm">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Sample image"
          loading="lazy"
        />
      </div>
      <div className="md:w-1/3 max-w-sm">
        <div className="text-center md:text-left">
          {isSignUpActive && <legend className="py-3">Sign up</legend>}
          {!isSignUpActive && <legend className="py-3">Sign in</legend>}
        </div>
        <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p className="mx-4 mb-0 text-center font-semibold text-slate-500" />
        </div>
        <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
          type="text"
          placeholder="Email Address"
          required
          onChange={handleEmailChange}
        />
        {isSignUpActive && (
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="text"
            placeholder="Name"
            required
            onChange={handleUserNameChange}
          />
        )}
        {isSignUpActive && (
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="text"
            placeholder="Designation"
            required
            onChange={handleDesignationChange}
          />
        )}
        <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
          type="password"
          placeholder="Password"
          required
          onChange={handlePasswordChange}
        />
        <div className="mt-4 flex justify-between font-semibold text-sm">
          <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer"></label>
        </div>
        <div className="text-center md:text-left">
          {isSignUpActive && (
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
              type="button"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          )}
          {!isSignUpActive && (
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
              type="button"
              onClick={handleSignIn}
            >
              Sign in
            </button>
          )}
        </div>
        <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          {isSignUpActive && (
            <div>
              Already have an account?{" "}
              <a
                className="text-red-600 hover:underline hover:underline-offset-4"
                href="#"
                onClick={handleMethodChange}
              >
                Login
              </a>
            </div>
          )}
          {!isSignUpActive && (
            <div>
              Don't have an account?{" "}
              <a
                className="text-red-600 hover:underline hover:underline-offset-4"
                href="#"
                onClick={handleMethodChange}
              >
                Register
              </a>
            </div>
          )}
        </div>
        <p className="text-red-500">{errMessage}</p>
      </div>
    </section>
  );
};
