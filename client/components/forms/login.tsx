import { type Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { IoLogoGithub } from "solid-icons/io";
import { createForm } from "@tanstack/solid-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { useAuth } from "@client/context/auth";

import { Button } from "@client/components/atoms/button";
import { TextField, TextFieldInput, TextFieldLabel } from "@client/components/atoms/text-field";

export const LoginForm: Component = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const form = createForm(() => ({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      await signIn(value);
    },
    validatorAdapter: zodValidator(),
  }));

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
    navigate("/");
  };

  return (
    <>
      <div class="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div class="grid gap-4">
            <form.Field
              name="email"
              validators={{
                onChange: z.string().email(),
              }}
              children={(field) => (
                <TextField
                  class="gap-1"
                  required
                  name={field().name}
                  value={field().state.value}
                  onChange={(value) => field().handleChange(value)}
                  onBlur={field().handleBlur}
                >
                  <TextFieldLabel for={field().name}>Email:</TextFieldLabel>
                  <TextFieldInput type="email" placeholder="me@email.com" />
                </TextField>
              )}
            />
            <form.Field
              name="password"
              children={(field) => (
                <TextField
                  class="gap-1"
                  required
                  name={field().name}
                  value={field().state.value}
                  onChange={(value) => field().handleChange(value)}
                  onBlur={field().handleBlur}
                >
                  <TextFieldLabel for={field().name}>Password:</TextFieldLabel>
                  <TextFieldInput type="password" placeholder="******" />
                </TextField>
              )}
            />
            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
              children={(state) => (
                <Button type="submit" disabled={!state().canSubmit}>
                  {state().isSubmitting ? "..." : "Login"}
                </Button>
              )}
            />
          </div>
        </form>
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button variant="outline" type="button" disabled={false}>
          <IoLogoGithub class="mr-2 size-4" /> Github
        </Button>
      </div>
    </>
  );
};
