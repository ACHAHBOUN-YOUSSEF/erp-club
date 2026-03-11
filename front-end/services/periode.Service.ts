import http from "@/lib/api/http"
import { PeriodeType } from "@/lib/validators/periodes"

export const PeriodeService={
    async getOne(id:number){
        const res=await http.get(`/api/periodes/${id}`)
        return res.data
    },
    async create(periode:PeriodeType){
        const res=await http.post("/api/periodes",periode)
        return res.data
    },
    async update(id:number,periode:PeriodeType){
        const res=await http.put(`/api/periodes/${id}`,periode)
        return res.data
    },
    async delete(periodeId:number){
        const res=await http.delete(`/api/periodes/${periodeId}`)
        return res.data
    }
}