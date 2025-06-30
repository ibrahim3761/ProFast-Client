import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaUserCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth.JSX";
import axios from "axios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {createUser,signInWithGoogle, updateUserProfile} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profilePic,setProfilePic] = useState('')

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then((result) => {
        console.log("User created successfully:", result.user);

        // update user profile in firebase
        const userProfile ={
          displayName: data.name,
          photoURL: profilePic
        }
        updateUserProfile(userProfile)
        .then(()=>{
          console.log('profile name pic updated');
        })
        .catch((error)=>{
          console.log(error.message);
          
        })
        navigate(`${location.state ? location.state : "/"}`);
      })
      .catch((error) => {
        console.error("Error creating user:", error.message);
      });
  };

  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then((result) => {
        console.log("User logged in successfully:", result.user);
        navigate(`${location.state ? location.state : "/"}`);
      })
      .catch((error) => {
        console.error("Error logging in with Google:", error.message);
      });
  };

  const handleImageUpload = async(e) =>{
    const image = e.target.files[0]
    console.log(image);
    const formData = new FormData();
    formData.append('image',image)

    const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`,formData)

    setProfilePic(res.data.data.url);
    
  }
  return (
    <div className="lg:mt-12">
      <h2 className="text-4xl font-extrabold mb-2">Create an Account</h2>
      <p className="text-lg text-black mb-6">Register with Profast</p>

      {/* Avatar */}
      <div className="flex mb-6">
        <FaUserCircle className="text-6xl text-gray-400" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name field */}
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="Name"
            className="input input-bordered w-full"
          />
        </div>
        {/* Pic field */}
        <div>
          <label className="label">Name</label>
          <input
          onChange={handleImageUpload}
            type="file"
            placeholder="Your Profile Piv"
            className="input input-bordered w-full"
          />
        </div>
        {/* Email field */}
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            placeholder="Email"
            className="input input-bordered w-full"
          />
          {errors.email?.type === "required" && (
            <p className="text-red-500">Email is required</p>
          )}
        </div>
        {/* Password field */}
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: 6,
              pattern: /^(?=.*[A-Z]).*$/,
            })}
            placeholder="Password"
            className="input input-bordered w-full"
          />
        </div>
        {errors.password?.type === "required" && (
          <p className="text-red-500">Password is required</p>
        )}
        {errors.password?.type === "minLength" && (
          <p className="text-red-500">
            Password must be 6 characters or longer{" "}
          </p>
        )}
        {errors.password?.type === "pattern" && (
          <p className="text-red-500">
            Password must contain at least one uppercase letter{" "}
          </p>
        )}

        <button type="submit" className="btn bg-[#CAEB66] w-full">
          Register
        </button>

        <p className="text-sm mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-[#CAEB66] font-medium">
            Login
          </Link>
        </p>

        <div className="divider">Or</div>

        <button onClick={handleGoogleLogin} className="btn btn-outline w-full">
          <svg
            aria-label="Google logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path
                fill="#34a853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              ></path>
              <path
                fill="#4285f4"
                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              ></path>
              <path
                fill="#fbbc02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              ></path>
              <path
                fill="#ea4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              ></path>
            </g>
          </svg>
          Register with Google
        </button>
      </form>
    </div>
  );
};

export default Register;
