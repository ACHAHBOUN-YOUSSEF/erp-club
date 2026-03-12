import { http } from "@/lib/api/http"
import { VilleSchema } from "@/lib/validators/villes"
export const villesService = {
    async getAll() {
        const res = await http.get("/api/villes")        
        return res.data.data
    },
    async getById(id:Number) {
        const res = await http.get(`/api/villes/${id}`)
        return res.data
    },
    async create(ville:VilleSchema){
        const res=await http.post("/api/villes",ville)
        return res.data
    },
    async update(id:Number,ville:VilleSchema){
        const res=await http.put(`/api/villes/${id}`,ville)
        return res.data
    },
    async delete(id:number){
        const res=await http.delete(`/api/villes/${id}`)
        return res.data
    }
}