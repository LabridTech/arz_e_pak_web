import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import path from "path";
import { signIn } from "next-auth/react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [img, setImage] = useState("");
  const [phone, setPhone] = useState(""); // State for phone number
  const [whatsapp, setWhatsapp] = useState(""); // State for WhatsApp number
  const [address, setAddress] = useState(""); // State for address


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate phone number format for Pakistan
    const phoneRegex = /^(\+92|92|0)?3[0-9]{2}[0-9]{7}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid Pakistani phone number.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("file", img);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const recivedata = await res.json();
      const message = recivedata.msg;
      const imgpath = path.join("uploads", img.name);

      const firebaseURL =
        "https://are-z-pak-default-rtdb.asia-southeast1.firebasedatabase.app/person.json";
      const data = {
        email,
        name,
        password,
        role,
        imgpath,
        phone,
        whatsapp,
        address,
      };

      const response = await axios.post(firebaseURL, data);
      console.log("Data successfully sent to Firebase:", response.data);
      if(response.data){
        signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl: "/", // Redirect after sign-in
        });
      }


      // Clear form after submission
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setImage("");
      setPhone("");
      setWhatsapp("");
      setAddress("");
    } catch (error) {
      console.error("Error sending data to Firebase:", error);
    }
  };

  return (
    <div className="font-[sans-serif] relative">
      <div className="h-[240px] font-[sans-serif]">
        <img
          src="/back1.jpg"
          alt="Banner Image"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative -mt-40 m-4">
        <form className="bg-white max-w-xl w-full mx-auto shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-8 rounded-2xl">
          <div className="mb-12">
            <h3 className="text-gray-800 text-3xl font-bold text-center">
              Register
            </h3>
          </div>

          <div>
            <label className="text-gray-800 text-xs block mb-2">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
              placeholder="Enter name"
            />
          </div>

          <div className="mt-8">
            <label className="text-gray-800 text-xs block mb-2">Email</label>
            <input
              name="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
              placeholder="Enter email"
            />
          </div>

          <div className="mt-8">
            <label className="text-gray-800 text-xs block mb-2">Password</label>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
              placeholder="Enter password"
            />
          </div>

          <div className="mt-8">
            <label className="text-gray-800 text-xs block mb-2">Phone</label>
            <input
              name="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
              placeholder="Enter phone number (e.g., 03001234567)"
            />
          </div>

          <div className="mt-8">
            <label className="text-gray-800 text-xs block mb-2">
              WhatsApp Number
            </label>
            <input
              name="whatsapp"
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
              placeholder="Enter WhatsApp number"
            />
          </div>

          <div className="mt-8">
            <label className="text-gray-800 text-xs block mb-2">Address</label>
            <input
              name="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
              placeholder="Enter your address"
            />
          </div>

          <div className="mt-8">
            <label className="text-gray-800 text-xs block mb-2">Role</label>
            <select
              name="role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ appearance: "none" }}
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
            >
              <option value="" disabled selected>
                Select role
              </option>
              <option value="agent">Agent</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="mt-8">
            <label className="text-gray-800 text-xs block mb-2">
              Upload Image
            </label>
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
              className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
            />
          </div>

          <div className="flex items-center mt-8">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 shrink-0 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-3 block text-sm"
            >
              I accept the{" "}
              <a
                href="javascript:void(0);"
                className="text-blue-500 font-semibold hover:underline ml-1"
              >
                Terms and Conditions
              </a>
            </label>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full shadow-xl py-2.5 px-5 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all"
            >
              Register
            </button>
            <p className="text-gray-800 text-sm mt-8 text-center">
              Already have an account?
              <Link
                href="/signin"
                className="text-blue-500 font-semibold hover:underline ml-1"
              >
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

