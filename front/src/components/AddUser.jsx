import { json, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    picture: null,
    cin: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isGuard, setIsGuard] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // WebSocket setup
  const { sendMessage } = useWebSocket("ws://localhost:8765", {
    onOpen: () => console.log("WebSocket connection established."),
    onClose: () => console.log("WebSocket connection closed."),
    onMessage: (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "addUserResponse") {
        if (data.success) {
          setMessage("User added successfully!");
        } else {
          setMessage(data.message);
        }
        setLoading(false);
      }
    },
  });
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.cin) newErrors.cin = "CIN is required";
    if (formData.picture == null) newErrors.picture = "Picture is required";
    if(isGuard){
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";

    }
    return newErrors;
  };

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    if (!adminStatus) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "isGuard") {
        setIsGuard(checked); // Sets isGuard to true if checked, false if unchecked
      } else if (name === "isAdmin") {
        setIsAdmin(checked); // Sets isAdmin similarly
      }
    } else {
      setFormData({
        ...formData,
        [name]: files ? files[0] : value,
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result.split(",")[1];
      const data = {
        type: "addUser",
        name: formData.name,
        cin: formData.cin,
        picture: base64Image,
        email: formData.email,
        password: formData.password,
        isGuard: isGuard,
        isAdmin: isAdmin,
      };  
      // Send data via WebSocket
      sendMessage(JSON.stringify(data));
    };
    reader.readAsDataURL(formData.picture);

  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-black min-h-screen">
      <div className="bg-white dark:bg-black dark:border-2 p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h1 className="text-lg font-semibold mb-4">Add User</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Name"
              aria-required="true"
              className={`mt-1 block w-full border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm px-2 focus:p-2 dark:focus:ring-indigo-500 bg-transparent dark:focus:border-indigo-500 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="picture" className="block text-sm font-medium">
              Picture
            </label>
            <input
              id="picture"
              name="picture"
              type="file"
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-sm shadow-sm ${
                errors.picture ? "border-red-500" : "border-gray-300"
              }`}
              accept="image/*"
              aria-describedby="pictureHelp"
              
            />
            
            <p id="pictureHelp" className="text-xs mt-1">
              Upload a profile picture (image files only).
            </p>
            {errors.cin && (
              <p className="mt-1 text-sm text-red-600">{errors.picture}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="cin" className="block text-sm font-medium">
              CIN
            </label>
            <input
              id="cin"
              name="cin"
              type="text"
              value={formData.cin}
              onChange={handleChange}
              placeholder="Enter CIN"
              aria-required="true"
              className={`mt-1 block w-full border ${
                errors.cin ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm bg-transparent px-2 focus:p-2 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.cin && (
              <p className="mt-1 text-sm text-red-600">{errors.cin}</p>
            )}
          </div>
          <div>
            <label className="inline-flex mb-2 items-center float-start cursor-pointer">
              <span className="ms-3 font-medium">Guard :</span>
              <input
                type="checkbox"
                name="isGuard"
                checked={isGuard} // This sets the checkbox state based on isGuard
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-indigo-600"></div>
            </label>
            <br />
            <br />
            {isGuard && (
              <div className="mb-16 animate-getbigY overflow-hidden">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Email"
                    aria-required="true"
                    className={`mt-1 block w-full border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm px-2 focus:p-2 dark:focus:ring-indigo-500 bg-transparent dark:focus:border-indigo-500 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="text"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    aria-required="true"
                    className={`mt-1 block w-full border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm px-2 focus:p-2 dark:focus:ring-indigo-500 bg-transparent dark:focus:border-indigo-500 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="inline-flex items-center float-start cursor-pointer">
                    <span className="ms-3 font-medium">Admin :</span>
                    <input
                      type="checkbox"
                      name="isAdmin"
                      checked={isAdmin}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {loading ? "Adding..." : "Add User"}
          </button>
          {message && <p className="mt-4 text-sm">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddUser;
