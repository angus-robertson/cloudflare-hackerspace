import { api } from "@client/libs/api";
import {
  createContext,
  createResource,
  createSignal,
  type Resource,
  useContext,
  type ParentComponent,
  createEffect,
  Show,
  type Accessor,
} from "solid-js";

import type { InferRequestType } from "hono/client";

import { User } from "@server/env";
import { useNavigate } from "@solidjs/router";

type LoginRequest = InferRequestType<typeof api.auth.login.$post>["json"];

type TAuthenticatedContext = {
  isSignedIn: Accessor<boolean>;
  isLoaded: boolean;
  user: Resource<User | undefined>;
  signIn: (req: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
};

const fetchUser = async () => {
  const result = await api.auth.me.$get();
  if (!result.ok) {
    console.log("Error - not authorized");
    return undefined;
  }
  const data = await result.json();
  console.log(data);
  return data;
};

const AuthContext = createContext<TAuthenticatedContext>();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("`useAuth` must be used within a `AuthProvider` component");
  }
  return context;
};

const AuthProvider: ParentComponent = (props) => {
  const navigate = useNavigate();

  const [isSignedIn, setIsSignedIn] = createSignal<boolean>(false);
  //const [user, setUser] = createSignal<User | undefined>(undefined);

  const [user, { mutate }] = createResource<User | undefined>(fetchUser);
  if (!user.error && user() != undefined) {
    setIsSignedIn(true);
    console.log("already signed in");
  }

  const signIn = async (req: LoginRequest) => {
    const res = await api.auth.login.$post({ json: req });
    if (res.ok) {
      const user = await res.json();
      setIsSignedIn(true);
      mutate(user);

      navigate(-1);

      console.log("signed in");
    }
  };

  const signOut = async () => {
    const res = await api.auth.logout.$post();
    if (res.ok) {
      setIsSignedIn(false);
      mutate();
      navigate("/", { replace: true });
      console.log("signed out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        isLoaded: !user.loading,
        user,
        signIn,
        signOut,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

const RouteGuard: ParentComponent = (props) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  createEffect(() => {
    if (!user.loading && !user()) {
      navigate("/login", { replace: true });
    }
  });

  return <Show when={!user.loading && user()}>{props.children}</Show>;
};

export { AuthProvider, useAuth, RouteGuard };
