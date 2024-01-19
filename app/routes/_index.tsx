import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="mx-auto mt-16 max-w-7xl text-center">
        <Link to="/victory" className="text-xl text-blue-600 underline">
          Victory Charts
        </Link>
      </div>
    </div>
  );
}
