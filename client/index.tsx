/* @refresh reload */
import { lazy } from "solid-js";
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

import "./index.css";

import { RouteGuard } from "@client/context/auth";

import { Layout } from "./pages/_layout";
import { HomePage } from "./pages/home";
const SignInPage = lazy(() => import("@client/pages/sign-in"));
const SignUpPage = lazy(() => import("@client/pages/sign-up"));
const DashboardPage = lazy(() => import("@client/pages/(protected)/dash"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router root={Layout}>
        <Route path="/login" component={SignInPage} />
        <Route path="/register" component={SignUpPage} />
        <Route path="/" component={RouteGuard}>
          <Route path="/dashboard" component={DashboardPage} />
        </Route>
        <Route path="/" component={HomePage} />
      </Router>
    </QueryClientProvider>
  ),
  document.getElementById("root")!
);
