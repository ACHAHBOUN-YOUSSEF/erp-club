import LoginPage from "@/components/ClinetsSideComponents/Management/Login/Login";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: "Bienvenue. Connectez-vous à votre espace StarGym. Adresse email. Mot de passe",
    icons:{
        icon:"/logo.stargym.png"
    }
}
const Page = () => {
    return <LoginPage />
};
export default Page