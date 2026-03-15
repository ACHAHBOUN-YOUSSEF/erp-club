import Layout from "@/components/ClinetsSideComponents/Management/Layout/Layout";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  icons:{icon:"/logo.stargym.png"},
  description:""
};
export default function ManagementLayout({ children }: { children: React.ReactNode }) {

  return <Layout>{children}</Layout>
}