import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket from "react-use-websocket";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [authResponse, setAuthResponse] = useState(null);
  const [error, setError] = useState(null);

  const { sendMessage } = useWebSocket("ws://localhost:8765", {
    onOpen: () => console.log("WebSocket connection established."),
    onClose: () => console.log("WebSocket connection closed."),
    onMessage: (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "authResponse") {
        if (data.success) {
          setAuthResponse("Login successful");
          localStorage.setItem("idgard", data.idgard);
          data.isAdmin && localStorage.setItem("isAdmin", 1);
          navigate("/"); // Redirect on successful login

        } else {
          setError("Login failed");
        }
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = JSON.stringify({
      type: "auth",
      email: email,
      password: password,
    });
    sendMessage(message);
  };

  return (
    <div className="flex items-center  justify-center min-h-screen ">
      <div className="w-full dark:border max-w-md p-8 space-y-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full  py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:bg-transparent focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium ">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full  py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:bg-transparent focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="block  w-1/4 mx-auto   py-2 mt-4 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-500 dark:border-blue-600 bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-2 focus:ring-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
