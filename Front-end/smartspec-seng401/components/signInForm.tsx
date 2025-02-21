"use client";
import React, { useState } from "react";
import {
  supabase,
  signInWithGitHub,
  signInWithGoogle,
} from "@/utils/supabaseClient";
import Link from "next/link";
import { Button } from "./ui/button";

const SignInForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });

    // DEBUG
    // console.log("Response: ", response);

    const { error } = response;
    if (error) {
      alert(error.message);
    } else {
      alert("Sign in successful");
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
      {" "}
      {/*space-y-6*/}
      <h2 className="text-7xl mb-6 font-normal text-center">Log In</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
          <p className="text-center text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit" variant={"default"} fullWidth>
            Log in
          </Button>
        </div>
      </form>
      <h1 className="mb-4 font-extrabold">OR</h1>
      <div>
        <button
          onClick={signInWithGoogle}
          className="p-2 bg-blue-500 text-white rounded mr-4"
        >
          Sign in with Google
        </button>
        <button
          onClick={signInWithGitHub}
          className="p-2 bg-gray-800 text-white rounded"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default SignInForm;
