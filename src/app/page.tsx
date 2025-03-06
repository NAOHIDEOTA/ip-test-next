// import Image from "next/image";
import { headers } from "next/headers";

interface IpListType {
  "x-forwarded-for"?       : string | null;
  "x-real-ip"?             : string | null;
  "x-vercel-forwarded-for"?: string | null;
  "req_ip"?                : string | null;
}
interface ResponceType {
  api: IpListType;
  middleware: IpListType;
}

export default async function Home() {
  const currentHeaders = headers();
  const accessIps = {
    "api": {
      "x-forwarded-for"       : currentHeaders.get('x-forwarded-for'),
      "x-real-ip"             : currentHeaders.get('x-real-ip'),
      "x-vercel-forwarded-for": currentHeaders.get('x-vercel-forwarded-for'),
    },
    "middleware": {
      "x-forwarded-for"       : currentHeaders.get('x-middle-forwarded-for'),
      "x-real-ip"             : currentHeaders.get('x-middle-real-ip'),
      "x-vercel-forwarded-for": currentHeaders.get('x-middle-vercel-forwarded-for'),
    },
  };

  // ChangeUrl To OwnServerUrl
  const baseUrl = "http://host.docker.internal:8092";
  const nodeRes = await fetch(`${baseUrl}/api/nodejs`, { cache: "no-store" });
  const nodeData: ResponceType = await nodeRes.json();
  const edgeRes = await fetch(`${baseUrl}/api/edge`,  { cache: "no-store" });
  const edgeData: ResponceType = await edgeRes.json();


  return (
    <main className="w-full max-w-screen-lg mx-auto p-20">
      <div className="rounded-lg bg-blue-900 p-10">
        <div>
          <h2 className="text-center text-xl font-bold">By Access</h2>
          <p className="text-sm opacity-80 text-center mt-1">アクセス時に取得</p>
        </div>
        <hr className="my-1"/>
        <div>
          <div className="flex items-center mt-4">
            <IpList title="Middleware" data={accessIps.middleware} />
            <IpList title="API" data={accessIps.api} />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-blue-900 p-10 mt-10">
        <div>
          <h2 className="text-center text-xl font-bold">By ServerFunction(nodejs)</h2>
          <p className="text-sm opacity-80 text-center mt-1">アクセス時にサーバーでAPIを実行時</p>
        </div>
        <hr className="my-1"/>
        <div>
          <div className="flex items-center mt-4">
            <IpList title="Middleware" data={nodeData.middleware} />
            <IpList title="API" data={nodeData.api} />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-blue-900 p-10 mt-10">
        <div>
          <h2 className="text-center text-xl font-bold">By ServerFunction(edge)</h2>
          <p className="text-sm opacity-80 text-center mt-1">アクセス時にサーバーでAPIを実行時</p>
        </div>
        <hr className="my-1"/>
        <hr />
        <div>
          <div className="flex items-center mt-4">
            <IpList title="Middleware" data={edgeData.middleware} />
            <IpList title="API" data={edgeData.api} />
          </div>
        </div>
      </div>
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
            <span className="text-sm opacity-80">{key}</span>: <span  className="font-bold">{value || "N/A"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
