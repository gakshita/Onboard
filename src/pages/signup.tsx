import { tr } from "@faker-js/faker";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useAuth } from "~/context";

interface SignUpFormProps {
  setHasRegistered: (val: boolean) => void;
  email: string;
  setEmail: any;
}
const SignUpForm: React.FC<SignUpFormProps> = ({
  setHasRegistered,
  email,
  setEmail,
}) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { signup, errMessage, loading, signupErr } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      setHasRegistered(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {" "}
      <form className="h-[580px]" onSubmit={handleSubmit}>
        <div className="mb-8">
          <label className="text-md" htmlFor="text">
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={name}
            className="border-light_grey text-md mt-2 w-full rounded-[6px] border-[1px] p-4"
            onChange={(e) => setName(e.target.value)}
          />
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
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            value={password}
            className="border-light_grey text-md mt-2 w-full rounded-[6px] border-[1px] p-4"
            onChange={(e) => setPassword(e.target.value)}
          />
          {signupErr?.data?.zodError?.fieldErrors.password && (
            <span className="mb-8 text-red-500">
              {signupErr.data.zodError.fieldErrors.password}
            </span>
          )}
        </div>

        <div className="mb-10">
          <button
            type="submit"
            className="bg-btn_bg text-text_color text-md  mt-2 w-full rounded-[6px] p-4 font-medium uppercase"
          >
            {loading ? (
              <span className="loader mr-3 !border-white"></span>
            ) : (
              "Create account"
            )}
          </button>
          <div className="mt-2 text-center text-red-500">
            {signupErr &&
              !signupErr.data!.zodError &&
              signupErr.data!.stack!.split("\n")[0]}
          </div>
        </div>
        <div className="flex justify-center">
          <span className="text-md">Have an Account? </span>
          <button
            className="text-md font-medium uppercase"
            onClick={() => router.push("/login")}
          >
            {" "}
            &nbsp;&nbsp;Login
          </button>
        </div>
      </form>
    </>
  );
};

interface VerifyEmailProps {
  email: string;
}
const VerifyEmail: React.FC<VerifyEmailProps> = ({ email }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [otp, setOtp] = useState<string[]>([]);
  const { verifyEmail, errMessage, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await verifyEmail(email, otp.join(""));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = (e.target as HTMLInputElement).value.slice(-1);
    if (isNaN(parseInt(value))) return;
    const newOtp: string[] = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 7) {
      inputRefs.current[index + 1]!.focus();
    }
  };

  const handleClick = (index: number) => {
    inputRefs.current && inputRefs.current[index]!.setSelectionRange(1, 1);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && index > 0) {
      if (otp[index] === "") {
        inputRefs.current[index - 1]!.focus();
        return;
      }
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-10 text-center">
        Enter the 8 digit code you have received on <br />
        <span className="font-semibold">{email}</span>
      </div>
      <div className="mb-10">
        <label className="text-md" htmlFor="email">
          Code
        </label>
        <div className="flex w-full gap-4">
          {" "}
          {Array.from({ length: 8 }).map((_, index) => (
            <input
              key={index}
              type="text"
              id="text"
              required
              value={otp[index]}
              ref={(input) => {
                if (input) inputRefs.current[index] = input;
              }}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => handleClick(index)}
              className="border-light_grey text-md mt-2 w-1/2 rounded-[6px] border-[1px] px-3 py-3 text-center"
            />
          ))}
        </div>
      </div>
      <button className="bg-btn_bg text-text_color text-md mt-2 w-full rounded-[6px] p-4 font-medium uppercase">
        {loading ? (
          <span className="loader mr-3 !border-white"></span>
        ) : (
          "Verify"
        )}
      </button>
      <div className="mt-2 text-center text-red-500">
        {errMessage && errMessage.data && errMessage.data.stack.split("\n")[0]}
      </div>
    </form>
  );
};

const SignUp = () => {
  const [hasRegistered, setHasRegistered] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="m-auto flex">
      <div className="border-light_grey m-auto w-[576px] rounded-[20px] border-[1px] px-12 py-10 ">
        <h1 className="text-xxxl mb-8 text-center font-semibold">
          {hasRegistered ? "Verify your email" : "Create your account"}
        </h1>
        {hasRegistered ? (
          <VerifyEmail email={email} />
        ) : (
          <SignUpForm
            setHasRegistered={setHasRegistered}
            setEmail={setEmail}
            email={email}
          />
        )}
      </div>
    </div>
  );
};
export default SignUp;
