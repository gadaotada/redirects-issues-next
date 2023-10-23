"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isWrongPw, setIsWrongPw] = useState(false);
  const [isUserExisting, setIsUserExisting] = useState(true);
  const [inputEmpty, setInputEmpty] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if(loginData.email.length > 0 && loginData.password.length > 0) {
      setInputEmpty(false)
    }

  }, [loginData])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loginData.email.length === 0 || loginData.password.length === 0) {
      setInputEmpty(true);
      return
    }
    try {
      setIsLoggingIn(true);
      setInputEmpty(false)
      const response = await fetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if(response.status === 400) {
        setIsUserExisting(false)
        if(isWrongPw) {
          setIsWrongPw(false)
        }
        return
      }

      if(response.status === 401) {
        setIsWrongPw(true)
        if(!isUserExisting) {
          setIsUserExisting(true)
        }
        return
      }
      if (response.ok) {
        console.log("Response for POST request was OK! :)");
        router.push("/dashboard");
        setIsWrongPw(false)
        setIsUserExisting(true)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-10 gap-10">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mt-10 gap-5"
      >
        <input
          className="p-4 rounded-md bg-zinc-950 bg-opacity-50 w-full text-lg outline-none placeholder:text-gray-600/60 hover:bg-zinc-900 hover:bg-opacity-40 transition duration-300"
          type="text"
          placeholder="Email"
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
          value={loginData.email}
        />
        <input
          className="p-4 rounded-md bg-zinc-950 bg-opacity-50 w-full text-lg outline-none placeholder:text-gray-600/60 hover:bg-zinc-900 hover:bg-opacity-40 transition duration-300"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          value={loginData.password}
        />
        {inputEmpty && <div className="text-blue-950 text-md font-semibold mt-1">Please fill out both fields!</div>}
        {isWrongPw && <div className="text-blue-950 text-md font-semibold mt-1">Wrong Password!</div>}
        {!isUserExisting && <div className="text-blue-950 text-md font-semibold mt-1">User does not exist!</div>}
        <button
          type="submit"
          className="p-4 rounded-md bg-zinc-950 bg-opacity-50 w-[60%] text-gray-600/60 font-semibold outline-none hover:bg-zinc-900 hover:bg-opacity-40 hover:text-gray-600/90 transition duration-300"
        >
          {isLoggingIn ? "Logging In..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
