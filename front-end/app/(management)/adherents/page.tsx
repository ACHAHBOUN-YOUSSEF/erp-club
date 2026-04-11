import { Suspense } from "react";
import AdherentsClient from "./AdherentsClient";
export default function Page() {

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-red-100 border-t-red-500 rounded-full animate-spin"></div>
            </div>
        }>
            <AdherentsClient />
        </Suspense>
    )
}
