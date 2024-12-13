import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function Signin() {
  const [showflag , setShowflag] = useState('password');
  function changeflag () {
  event.preventDefault() 
  if(showflag === 'password') {
    setShowflag('text')
  }else{
    setShowflag('password') 
  }
 
  }
  return (
    <div class="font-[sans-serif] relative">
      <div class="h-[240px] font-[sans-serif]">
        <img
          src="/back1.jpg"
          alt="Banner Image"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="relative -mt-40 m-4">
        <form
          class="bg-white max-w-xl w-full mx-auto shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-8 rounded-2xl"
          onSubmit={async (e) => {
            e.preventDefault();
          
            const email = e.target.email.value;
            const password = e.target.password.value;
          
            try {
              // Call signIn with credentials
              const result = await signIn("credentials", {
                email,
                password,
                redirect: false, // Set to false to handle redirection manually
              });
          
              if (result.error) {
                // Show toast for error
                toast.error("Login failed: " + result.error, {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
                console.error("Login failed:", result.error);
              } else {
          
                // Show toast for success
                toast.success("Login successful!", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
          
                // Redirect after successful login
                window.location.href =  "/";
              }
            } catch (error) {
              // Show toast for unexpected error
              toast.error("An unexpected error occurred.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
              console.error("An error occurred during login:", error);
            }
          }}
          
        >
          <div class="mb-12">
            <h3 class="text-gray-800 text-3xl font-bold text-center">Login</h3>
          </div>

          <div class="mt-8">
            <label class="text-gray-800 text-xs block mb-2">Email</label>
            <div class="relative flex items-center">
              <input
                name="email"
                type="text"
                required
                class="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
                placeholder="Enter email"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#bbb"
                stroke="#bbb"
                class="w-[18px] h-[18px] absolute right-2"
                viewBox="0 0 682.667 682.667"
              >
                <defs>
                  <clipPath id="a" clipPathUnits="userSpaceOnUse">
                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                  </clipPath>
                </defs>
                <g
                  clip-path="url(#a)"
                  transform="matrix(1.33 0 0 -1.33 0 682.667)"
                >
                  <path
                    fill="none"
                    stroke-miterlimit="10"
                    stroke-width="40"
                    d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                    data-original="#000000"
                  ></path>
                  <path
                    d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                    data-original="#000000"
                  ></path>
                </g>
              </svg>
            </div>
          </div>

          <div class="mt-8">
            <label class="text-gray-800 text-xs block mb-2">Password</label>
            <div class="relative flex items-center">
              <input
                name="password"
                type={showflag}
                required
                class="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
                placeholder="Enter password"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#bbb"
                stroke="#bbb"
                onClick={changeflag}
                class="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                viewBox="0 0 128 128"
              >
                <path
                  d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                  data-original="#000000"
                ></path>
              </svg>
            </div>
          </div>

          <div class="mt-8">
            <button
              type="submit"
              class="w-full shadow-xl py-2.5 px-5 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all"
            >
              Login
            </button>
            <p class="text-gray-800 text-sm mt-8 text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                class="text-blue-500 font-semibold hover:underline ml-1"
              >
                Signup here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
