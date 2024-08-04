import { type ParentComponent } from "solid-js";

import { AuthProvider } from "@client/context/auth";

import { Header } from "@client/components/header";

export const Layout: ParentComponent = (props) => {
  return (
    <>
      <AuthProvider>
        <Header />
        {props.children}
      </AuthProvider>
    </>
  );
};
