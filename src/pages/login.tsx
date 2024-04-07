import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "~/context";

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const {
    authState: { isUserLoggedIn },
    login,
    errMessage,
    loading,
  } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password);
  };
  useEffect(() => {
    isUserLoggedIn && router.push("/interests");
  }, [isUserLoggedIn]);

  return (
    <div className="m-auto flex">
      <div className="border-light_grey m-auto w-[576px] rounded-[20px] border-[1px] px-12 py-10 ">
        <h1 className="text-xxxl mb-8 text-center font-semibold">Login </h1>
        <form className="h-[500px]" onSubmit={handleSubmit}>
          <div className="text-xxl mb-2 text-center font-medium">
            Welcome back to ECOMMERCE
          </div>
          <div className="text-md mb-7 text-center">
            The next gen business marketplace
          </div>
          <div className="mb-8">
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              className="border-light_grey text-md mt-2 w-full rounded-[6px] border-[1px] p-4"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <label className="text-md" htmlFor="email">
              Password
            </label>
            <div className="flex-between border-light_grey flex rounded-[6px] border-[1px] p-4">
              {" "}
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className=" text-md m-0 w-full "
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="leading-[19px] underline"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword((state) => !state);
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="mb-10">
            <button
              type="submit"
              className="bg-btn_bg text-text_color text-md mt-2 flex w-full justify-center rounded-[6px] p-4 font-medium uppercase"
            >
              {loading ? (
                <span className="loader mr-3 !border-white"></span>
              ) : (
                "Login"
              )}
            </button>
            <div className="mt-2 text-center text-red-500">
              {errMessage && errMessage?.data?.stack.split("\n")[0]}
            </div>
          </div>
          <div className="flex justify-center">
            <span className="text-md">Don’t have an Account? </span>
            <button
              type="button"
              className="text-md font-medium uppercase"
              onClick={() => router.push("/signup")}
            >
              {" "}
              &nbsp;&nbsp;Sign up
            </button>
          </div>
        </form>{" "}
      </div>
    </div>
  );
};
export default Login;
