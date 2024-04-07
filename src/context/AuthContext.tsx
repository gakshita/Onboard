import { useRouter } from "next/router";
import {
  createContext,
  Dispatch,
  useContext,
  useReducer,
  useState,
} from "react";
import {
  authDispatchFunction,
  initialAuthState,
  AuthState,
  PayloadInterface,
} from "~/reducers/authReducer";
import { api, setToken } from "~/utils/api";

interface AuthContextType {
  authState: AuthState;
  authDispatch: Dispatch<{ type: string; payload: PayloadInterface }>;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, authDispatch] = useReducer(
    authDispatchFunction,
    initialAuthState,
  );
  // const router = useRouter();

  // function previousVersionUserCleanup() {
  //   localStorage.removeItem("Login");
  //   alert("Welcome to Dove v2. Signup to continue.");
  //   router.push("/signup");
  // }

  // useEffect(() => {
  //   const memory = JSON.parse(localStorage.getItem("Login") || "{}");
  //   if (memory?.isUserLoggedIn === true) {
  //     if (memory.token) {
  //       authDispatch({
  //         type: "LOGIN_BY_LOCAL_STORAGE",
  //         payload: { user: memory },
  //       });
  //     } else {
  //       previousVersionUserCleanup();
  //     }
  //   }
  // }, [authDispatch]);
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
    onSuccess: ({ token, data }) => {
      setToken(token);
      console.log(data);
      router.push(`/interests/${data.user.id}`);
    },
    onError: (err: any) => {
      setErrMessage(err), console.log(err);
    },
  });
  const { mutateAsync: asyncVerify } = api.user.verify.useMutation({
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
      setLoading(false);
      console.log(err);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await asyncSignup({ name, email, password });
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
