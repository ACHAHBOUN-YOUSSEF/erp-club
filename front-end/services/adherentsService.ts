import { http } from "@/lib/api/http"
import { adherentType } from "@/lib/validators/adherents"
export const ServiceAdherent = {
    async get(id: number) {
        const res = await http.get(`/api/adherents/${id}`)
        return res.data
    },
    async create(adherent: adherentType) {
        const res = await http.post("/api/adherents", adherent)
        return res.data
    },
    async update(id:number,adherent:adherentType){
        const res=await http.put(`/api/adherents/${id}`,adherent)
        return res.data
    },
    async getAll(params?: string) {
        const url = params ? `/api/adherents${params}` : '/api/adherents';
        const res = await http.get(url);
        return res;
    },
    async delete(id: number) {
        const res = await http.delete(`/api/adherents/${id}`)
        return res.data
    },
    async getAllByClub(clubId: number, params?: string) {
        const url = params ? `/api/adherents/clubs/${clubId}${params}` : `/api/adherents/clubs/${clubId}`;
        const res = await http.get(url);
        return res; 
    },
    async search(value:string){
        const res=await http.post(`/api/adherents/search`,{value:value})
        return res.data
    }


}