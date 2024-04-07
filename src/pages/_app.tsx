import { type AppType } from "next/app";
import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Navbar from "~/components/navbar";
import { AuthProvider } from "~/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const MyApp: AppType = ({ Component, pageProps }) => {
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
