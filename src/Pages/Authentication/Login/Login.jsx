import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth.JSX";
import useAxios from "../../../Hooks/useAxios";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signInWithGoogle, signIn } = useAuth();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const location = useLocation();

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then(async(result) => {
        console.log("User logged in successfully:", result.user);
        // update user in the database
        const userInfo = {
          email: data.email,
          role: "user", //default role
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        console.log(userInfo);
        const userRes = await axiosInstance.post("/users", userInfo);
        console.log(userRes.data);
        navigate(`${location.state ? location.state : "/"}`);
      })
      .catch((error) => {
        console.error("Login failed:", error.message);
        // Optional: Show toast or Swal alert
      });
  };

  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then(async (result) => {
        console.log("User logged in successfully:", result.user);
        // update user in the database
        const userInfo = {
          email: result.user.email,
          role: "user", //default role
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        const userRes = await axiosInstance.post("/users", userInfo);
        console.log("user update info", userRes.data);
        navigate(`${location.state ? location.state : "/"}`);
      })
      .catch((error) => {
        console.error("Error logging in with Google:", error.message);
      });
  };
  return (
    <div>
      <h2 className="text-4xl font-extrabold mb-6">Welcome Back</h2>
      <p className="text-lg text-black mb-6">Login with Profast</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email")}
            className="input input-bordered w-full"
            placeholder="Email"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: 6,
              pattern: /^(?=.*[A-Z]).*$/,
            })}
            className="input input-bordered w-full"
            placeholder="Password"
          />
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
        </div>
        <div className="text-left mb-5">
          <a className="text-sm text-[#71717A] border-b border-[#71717A] pb-[2px] hover:text-[#CAEB66] hover:border-[#CAEB66] cursor-pointer">
            Forgot password?
          </a>
        </div>
        <button className="btn bg-[#CAEB66] w-full">Login</button>
        <div className="text-sm mt-4">
          Don’t have any account?{" "}
          <Link to="/register" className="text-[#CAEB66] underline">
            Register
          </Link>
        </div>
        <div className="divider">OR</div>
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
          Login with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
