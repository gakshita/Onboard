import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Navbar from "~/components/navbar";
import { AuthProvider, useAuth } from "~/context/AuthContext";
import { useEffect } from "react";

const protectedRoutes = ["/interests"];
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const {
    authState: { userId },
  } = useAuth();

  useEffect(() => {
    const isAuth = userId !== null && userId !== undefined;
    if (!isAuth && protectedRoutes.includes(router.pathname)) {
      router.push("/login");
    }
  }, []);

  return (
    <main className={`font-sans ${inter.variable}`}>
      <AuthProvider>
        <>
          {" "}
          <Navbar />
          <Component {...pageProps} />
        </>
      </AuthProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
