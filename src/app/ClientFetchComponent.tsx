"use client";

import { useState } from "react";

interface IpListType {
  "x-forwarded-for"?: string | null;
  "x-real-ip"?: string | null;
  "x-vercel-forwarded-for"?: string | null;
  req_ip?: string | null;
}
interface ResponceType {
  api: IpListType;
  middleware: IpListType;
}

export default function ClientFetchComponent() {
  const [data, setData] = useState<ResponceType | null>(null);
  const [mode, setMode] = useState<"nodejs" | "edge">("nodejs");

  const execute = async () => {
    setData(null);
    const res = await fetch(`/api/${mode}`, { cache: "no-store" });
    setData(await res.json());
  };

  return (
    <div className="rounded-lg bg-blue-900 p-10 mt-10 relative">
      <p className="absolute top-5 right-5 py-2 px-4 rounded-xl bg-green-500">
        correct
      </p>
      <div>
        <h2 className="text-xl font-bold">By ClientSide</h2>
        <p className="text-sm opacity-80 mt-1">
          I understand that I can obtain it when executing fetch from the client
          side.
        </p>
      </div>
      <hr className="mt-4" />
      <div className="flex items-center justify-center mt-4">
        <button
          className={`py-2 px-5 border-amber-600 bg-amber-600 bg-opacity-20 rounded-lg mx-2 ${
            mode === "nodejs" ? "bg-opacity-100" : ""
          }`}
          onClick={() => {
            setMode("nodejs");
            execute();
          }}
        >
          nodejs
        </button>
        <button
          className={`py-2 px-5 border-amber-600 bg-amber-600 bg-opacity-20 rounded-lg mx-2 ${
            mode === "edge" ? "bg-opacity-100" : ""
          }`}
          onClick={() => {
            setMode("edge");
            execute();
          }}
        >
          edge
        </button>
      </div>
      <hr className="mt-4" />
      {data && (
        <div>
          <div className="flex items-center mt-4">
            <IpList title="Middleware" data={data.middleware} />
            <IpList title="API" data={data.api} />
          </div>
        </div>
      )}
    </div>
  );
}

const IpList = ({ title, data }: { title: string; data: IpListType }) => {
  return (
    <div className="mb-4 w-full mx-2">
      <h3 className="text-lg font-semibold mb-2 text-center">@{title}</h3>
      <ul className="bg-gray-800 p-4 rounded-lg">
        {Object.entries(data).map(([key, value]) => (
          <li key={key} className="py-1">
            <span className="text-sm opacity-80">{key}</span>:{" "}
            <span className="font-bold">{value || "N/A"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
