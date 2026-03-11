import { http } from "@/lib/api/http"
import { AbonnementType } from "@/lib/validators/abonnements"

export const AbonnementsService = {
    async getAll() {
        const res = await http.get("/api/abonnements")
        return res.data
    },
    async getById(id:number) {
        const res=await http.get(`/api/abonnements/${id}`)
        return res.data
    },
    async getByGroupe(GroupeId:number){
        const res=await http.get(`/api/abonnements/groupes/${GroupeId}`)
        return res.data
    },
    async create(abonnement: AbonnementType) {
        const res = await http.post("/api/abonnements", abonnement)
        return res.data
    },
    async update(abonnement:AbonnementType,id:number) {
        const res=await http.put(`/api/abonnements/${id}`,abonnement)
        return res.data
    },
    async delete(id: number|null) {
        const res=await http.delete(`/api/abonnements/${id}`)
        return res.data
    }
}