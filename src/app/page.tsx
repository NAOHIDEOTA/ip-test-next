// import Image from "next/image";
import { headers } from "next/headers";
import ClientFetchComponent from "./ClientFetchComponent";
import { cookies } from "next/headers";

interface IpListType {
  "x-forwarded-for"?: string | null;
  "x-real-ip"?: string | null;
  "x-vercel-forwarded-for"?: string | null;
  req_ip?: string | null;
  cookie_ip?: string | null;
}
interface ResponceType {
  api: IpListType;
  middleware: IpListType;
}

export default async function Home() {
  const cookieStore = cookies();
  const ipCookie = cookieStore.get("test")?.value;
  const allCookie = cookieStore
      .getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join(";");
  const currentHeaders = headers();
  const accessIps:ResponceType = {
    api: {
      "x-forwarded-for": currentHeaders.get("x-forwarded-for"),
      "x-real-ip": currentHeaders.get("x-real-ip"),
      "x-vercel-forwarded-for": currentHeaders.get("x-vercel-forwarded-for"),
      cookie_ip: ipCookie ?? ""
    },
    middleware: {
      "x-forwarded-for": currentHeaders.get("x-middle-forwarded-for"),
      "x-real-ip": currentHeaders.get("x-middle-real-ip"),
      "x-vercel-forwarded-for": currentHeaders.get(
        "x-middle-vercel-forwarded-for"
      ),
      cookie_ip: ipCookie ?? ""
    },
  };

  // ChangeUrl To OwnServerUrl
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const nodeRes = await fetch(`${baseUrl}/api/nodejs`, { cache: "no-store",  headers: {
    "Cookie": allCookie
  }, },);
  const nodeData: ResponceType = await nodeRes.json();
  const edgeRes = await fetch(`${baseUrl}/api/edge`, { cache: "no-store",  headers: {
    "Cookie": allCookie
  }, });
  const edgeData: ResponceType = await edgeRes.json();

  return (
    <main className="w-full max-w-screen-lg mx-auto p-20 text-white">
      <div className="rounded-lg bg-blue-900 p-10 relative">
        <p className="absolute top-5 right-5 py-2 px-4 rounded-xl bg-green-500">
          correct
        </p>
        <div>
          <h2 className="text-xl font-bold">Access</h2>
          <p className="text-sm opacity-80 mt-1">Obtained when accessing:</p>
          <ul className="text-sm opacity-80 mt-1 list-decimal  list-inside">
            <li>middleware.tsx (EdgeMiddleware)</li>
            <li>page.tsx (RSC_Fetch)</li>
            <li>Rendering</li>
          </ul>
        </div>
        <hr className="mt-4" />
        <div>
          <div className="flex items-center mt-4">
            <IpList title="Middleware" data={accessIps.middleware} />
            <IpList title="API" data={accessIps.api} />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-blue-900 p-10 mt-10 relative">
        <p className="absolute top-5 right-5 py-2 px-4 rounded-xl bg-red-500">
          incorrect
        </p>
        <div>
          <h2 className="text-xl font-bold">By RSC_Fetch(runtime:nodejs)</h2>
          <p className="text-sm opacity-80 mt-1">
            When accessing the server and executing the API:
          </p>
          <ul className="text-sm opacity-80 mt-1 list-decimal  list-inside">
            <li>page.tsx (RSC_Fetch)</li>
            <p className="pl-5">- execute api(fetch) -</p>
            <li>
              middleware.tsx (I thought it was Edge Middleware, but its not)
            </li>
            <li>api/route.tsx (on Nodejs)</li>
            <li>Rendering</li>
          </ul>
        </div>
        <hr className="mt-4" />
        <div>
          <div className="flex items-center mt-4">
            <IpList title="Middleware" data={nodeData.middleware} />
            <IpList title="API" data={nodeData.api} />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-blue-900 p-10 mt-10 relative">
        <p className="absolute top-5 right-5 py-2 px-4 rounded-xl bg-red-500">
          incorrect
        </p>
        <div>
          <h2 className="text-xl font-bold">By RSC_Fetch(runtime:edge)</h2>
          <p className="text-sm opacity-80 mt-1">
            When accessing the server and executing the API:
          </p>
          <ul className="text-sm opacity-80 mt-1 list-decimal  list-inside">
            <li>page.tsx (RSC_Fetch)</li>
            <p className="pl-5">- execute api(fetch) -</p>
            <li>
              middleware.tsx (I thought it was Edge Middleware, but its not)
            </li>
            <li>api/route.tsx (on Nodejs)</li>
            <li>Rendering</li>
          </ul>
        </div>
        <hr className="mt-4" />
        <div>
          <div className="flex items-center mt-4">
            <IpList title="Middleware" data={edgeData.middleware} />
            <IpList title="API" data={edgeData.api} />
          </div>
        </div>
      </div>

      <ClientFetchComponent></ClientFetchComponent>
    </main>
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
