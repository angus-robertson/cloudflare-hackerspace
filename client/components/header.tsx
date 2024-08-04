import { type Component, Show } from "solid-js";

import { Avatar, AvatarFallback } from "@client/components/atoms/avatar";
import { Button } from "@client/components/atoms/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@client/components/atoms/dropdown";

import { useAuth } from "@client/context/auth";
import { A } from "@solidjs/router";

export const Header: Component = () => {
  const { user, signOut } = useAuth();

  return (
    <header>
      <nav class="px-4 py-2.5">
        <div class="flex items-center justify-between">
          <div>
            <A href="/" class="hover:font-bold">
              Hackerspace
            </A>
          </div>
          <div>
            <Show when={!user.loading && user()}>
              <DropdownMenu placement="bottom-end">
                <DropdownMenuTrigger as={Button<"button">} variant="ghost" class="relative size-8 rounded-full">
                  <Avatar class="size-8">
                    <AvatarFallback>
                      {user()?.firstName.charAt(0)}
                      {user()?.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <div class="flex flex-col space-y-1">
                      <p class="text-sm font-medium leading-none">
                        {user()?.firstName} {user()?.lastName}
                      </p>
                      <p class="text-xs leading-none text-muted-foreground">{user()?.email}</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Show>
            <Show when={!user.loading && !user()}>
              <Button variant="ghost" as={A} href="/login">
                Login
              </Button>
              <Button as={A} href="/register">
                Register
              </Button>
            </Show>
          </div>
        </div>
      </nav>
    </header>
  );
};
