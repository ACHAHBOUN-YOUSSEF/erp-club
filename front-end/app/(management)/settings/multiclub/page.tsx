"use client";
import VillesTables from "@/components/ui/tables/VillesTables";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ClubsTables from "@/components/ui/tables/ClubsTables";
import NewVille from "@/components/ui/forms/villes/newVille";
import { useEffect, useState } from "react";
import { villesService } from "@/services/villesService";
import { toast } from "react-toastify";
import Spinner from "@/components/ui/spinner";
export default function Multiclub() {
    const [villes, setVilles] = useState([])
    const [loading, setLoading] = useState(false)
    const [isBusy, setIsBusy] = useState(false)
    const loadVilles = async () => {
        setLoading(true)
        setIsBusy(true)

        try {
            setVilles(await villesService.getAll())
        } catch (err) {
            toast.error("Erreur lors de telechargement de Villes")
        } finally {
            setLoading(false)
            setIsBusy(false)

        }
    }
    const deleteVille = async (id: number) => {
        try {
            const res = await villesService.delete(id)
            toast.success(res.message)
            loadVilles()
        } catch (err) {
            toast.error("Erreur lors de la suppresion de Ville")
        }
    }
    useEffect(() => {
        loadVilles()
    }, [])
    return (
        <div className="bg-red-100 dark:bg-black m-2 p-2 rounded-lg">
            {isBusy && <Spinner />}
            <Tabs defaultValue="tab1">
                {/* NAV */}
                <div className="border-b border-gray-200 flex justify-center dark:border-neutral-700">
                    <TabsList className="-mb-0.5 flex  gap-x-6 bg-transparent overflow-x-auto overflow-y-hidden">
                        <TabsTrigger
                            value="tab1"
                            className="py-4 px-1 text-sm border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:font-semibold data-[state=active]:text-red-600 text-gray-500 dark:text-neutral-400 hover:text-red-600"
                        >
                            Villes
                        </TabsTrigger>

                        <TabsTrigger
                            value="tab2"
                            className="py-4 px-1 text-sm border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:font-semibold data-[state=active]:text-red-600 text-gray-500 dark:text-neutral-400 hover:text-red-600"
                        >
                            Clubs
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* CONTENT */}
                <div className="mt-3">
                    <TabsContent value="tab1">
                        <VillesTables isBusy={(value: boolean) => setIsBusy(value)} villes={villes} loading={loading} onDelete={(id: number) => deleteVille(id)} onUpdate={() => loadVilles()} />
                        <hr className="border-b border-gray-400 m-2" />
                        <NewVille onSuccess={loadVilles} />
                    </TabsContent>
                    <TabsContent value="tab2">
                        <ClubsTables isBusy={(value: boolean) => setIsBusy(value)} />
                    </TabsContent>
                </div>
            </Tabs>

        </div>
    )
}


