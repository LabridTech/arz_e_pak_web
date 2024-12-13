import "@/styles/globals.css";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import Signup from "./signup";
import Signin from "./signin";
import { store } from "../redux/store/store";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }) {
  const route = useRouter();
  if (route.pathname === "/signin") {
    return (
      <SessionProvider>
        <Provider store={store}>
          {" "}
          <Signin />
          <ToastContainer />
        </Provider>
      </SessionProvider>
    );
  } else if (route.pathname === "/signup") {
    return (
      <SessionProvider>
        <Provider store={store}>
          <Signup /> <ToastContainer />
        </Provider>
      </SessionProvider>
    );
  } else {
    return (
      <SessionProvider>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
            <ToastContainer />
          </Layout>
        </Provider>
      </SessionProvider>
    );
  }
}
