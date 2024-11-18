import type { Metadata } from "next";
import Link from "next/link";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode}>) {
  return (
    <html>
      <body>
        <div className={'z-10 fixed top-0 left-0 w-full h-[50px] flex items-center justify-center bg-black'}><Link href={'/'} className={`shrink-0 font-[700] text-2xl`} style={{fontFamily: "'ubuntu', Arial, sans-serif"}}>shortt</Link></div>
        <div className={'mt-[50px] w-full h-[calc(100%-50px)] flex justify-center'}>
            <div className={'relative w-full max-w-[640px] h-full flex flex-col items-center'}>{children}</div>
        </div>
      </body>
    </html>
  );
}
