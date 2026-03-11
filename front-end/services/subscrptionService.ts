import { http } from "@/lib/api/http"
import { newSubscriptionType } from "@/lib/validators/new-subscriptions"
import { SubscriptionType } from "@/lib/validators/subscriptions"
export const SubscriptionService = {
    async getById(id:number) {
        const res=await http.get(`/api/subscriptions/${id}`)
        return res.data
    },
    // async getByGroupe(GroupeId:number){
    //     const res=await http.get(`/api/abonnements/groupes/${GroupeId}`)
    //     return res.data
    // },
    async create(subscription:newSubscriptionType) {
        const res = await http.post("/api/subscriptions", subscription)
        return res.data
    },
    async update(subscription:SubscriptionType,id:number) {
        const res=await http.put(`/api/subscriptions/${id}`,subscription)
        return res.data
    },
    async delete(id: number|null) {
        const res=await http.delete(`/api/subscriptions/${id}`)
        return res.data
    }
}