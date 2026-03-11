import { http } from "@/lib/api/http"
import { clubType } from "@/lib/validators/clubs"

export const clubsService={
    async getAll(){
        const res=await http.get("/api/clubs")
        return res.data
    },
    async getById(id:number){
        const res=await http.get(`/api/clubs/${id}`)
        return res.data.data
    },
    async getClubsByVilleId(villeId:number){
        const res=await http.get(`/api/clubs/villes/${villeId}`)
        return res.data
    },
    async create(club:clubType){
        const res=await http.post("/api/clubs",club)
        return res.data
    },
    async update(id:number,club:clubType){
        const res=await http.put(`/api/clubs/${id}`,club)
        return res.data
    },
    async delete(id:number){
        const res=await http.delete(`/api/clubs/${id}`)
        return res.data
    }
}