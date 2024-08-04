import { createSignal, type Component } from "solid-js";

export const HomePage: Component = () => {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <h1 class="text-3xl font-bold underline text-red-600">Vite + Solid + Cloudflare</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count()}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">Click on the Vite and Solid logos to learn more</p>
    </>
  );
};
