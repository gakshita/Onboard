import { useRouter } from "next/router";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { authDispatchFunction, initialAuthState } from "~/reducers/authReducer";
import { api } from "~/utils/api";

interface AuthContextType {
  authState: any;
  authDispatch: any;
}

interface errMessageType {
  message: string;
  data: {
    stack: string;
  };
}
const AuthContext = createContext<AuthContextType>({
  authState: initialAuthState,
  authDispatch: () => {},
});

export function AuthProvider({ children }: React.PropsWithChildren<{}>) {
  const [authState, authDispatch] = useReducer(
    authDispatchFunction,
    initialAuthState,
  );
  const router = useRouter();

  function previousVersionUserCleanup() {
    localStorage.removeItem("Login");
    alert("Welcome to Dove v2. Signup to continue.");
    router.push("/signup");
  }

  console.log(authState);
  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const { authState, authDispatch } = useContext(AuthContext);
  const [errMessage, setErrMessage] = useState<errMessageType | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { mutateAsync: asyncLogin } = api.user.login.useMutation({
    onError: (err: any) => {
      setErrMessage(err), console.log(err);
    },
  });
  const { mutateAsync: asyncVerify, error } = api.user.verify.useMutation({
    onSuccess: () => router.push("/login"),
    onError: (err: any) => {
      setErrMessage(err), console.log(err);
    },
  });

  const { mutateAsync: asyncSignup, error: signupErr } =
    api.user.register.useMutation({
      onError: (err: any) => {
        setErrMessage(err), console.log(err);
      },
    });

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await asyncLogin({
        email,
        password,
      });
      authDispatch({
        type: "SAVE_LOGIN_DETAILS",
        payload: {
          username: res.data.user.name,
          email: res.data.user.email,
          token: res.token,
          id: res.data.user.id,
        },
      });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const res = await asyncSignup({ name, email, password });
      console.log(res);
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      throw new Error(err);
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    setLoading(true);
    try {
      const res = await asyncVerify({
        email,
        otp,
      });
      router.push("/login");
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  return {
    login,
    errMessage,
    setErrMessage,
    authState,
    authDispatch,
    loading,
    signup,
    signupErr,
    verifyEmail,
  };
}
