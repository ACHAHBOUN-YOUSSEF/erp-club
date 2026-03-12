import { Suspense } from "react";
import AdherentsClient from "./AdherentsClient";
export default function Page() {

    return (
        <Suspense fallback={<div>Chargement adhérents...</div>}>
            <AdherentsClient />
        </Suspense>
    )
}
