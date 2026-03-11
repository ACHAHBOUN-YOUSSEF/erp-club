import { http } from "@/lib/api/http"
import { GroupeAbonnementType } from "@/lib/validators/groupeAbonnements"

export const groupeAbonnementsService = {
    async getAll() {
        const res = await http.get("/api/groupes_abonnements")
        return res.data
    },
    async getById(id:number) {
        const res=await http.get(`/api/groupes_abonnements/${id}`)
        return res.data
    },
    async getGroupesByClubId(clubId: number) {
        const res = await http.get(`/api/groupes_abonnements/clubs/${clubId}`)
        return res.data
    },
    async create(groupe: GroupeAbonnementType) {
        const res = await http.post("/api/groupes_abonnements", groupe)
        return res.data
    },
    async update(groupe:GroupeAbonnementType,id:number) {
        const res=await http.put(`/api/groupes_abonnements/${id}`,groupe)
        return res.data
    },
    async delete(id: number|null) {
        const res=await http.delete(`/api/groupes_abonnements/${id}`)
        return res.data
    }
}