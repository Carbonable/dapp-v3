import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div>
      <div className="2xl:max-w-8xl min-h-screen max-w-full lg:mx-auto lg:max-w-6xl xl:max-w-7xl">
        <Link className="flex items-center justify-start my-8 hover:brightness-110" href="/">
          <ArrowLeftIcon className="h-4 w-4" />
          <div className="ml-1 text-sm font-semibold">Back</div>
        </Link>
        <div className="p-4">
            {children}
        </div>
      </div>
    </div>
  );
}