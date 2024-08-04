import { type Component } from "solid-js";

import { Button } from "@client/components/atoms/button";
import { LoginForm } from "@client/components/forms/login";

export const SignInPage: Component = () => {
  return (
    <>
      <Button variant="ghost" class="absolute right-4 top-4 md:right-8 md:top-8">
        Login
      </Button>
      <div class="lg:p-8">
        <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div class="flex flex-col space-y-2 text-center">
            <h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p class="text-sm text-muted-foreground">Enter your email below to create your account</p>
          </div>
          <LoginForm />
          <p class="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a href="/terms" class="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" class="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
