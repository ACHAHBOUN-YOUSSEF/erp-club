import HomePage from "@/components/ClinetsSideComponents/Management/Home/Home";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: "Bienvenue. Connectez-vous à votre espace StarGym. Adresse email. Mot de passe",
    icons:{
        icon:"/logo.stargym.png"
    }
}
export default function Home() {

  return (<HomePage/>)
}