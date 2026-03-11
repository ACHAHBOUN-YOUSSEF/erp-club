import http from "@/lib/api/http"
import { TransactionType } from "@/lib/validators/transactions"

export const transactionService = {
    async create(transaction:TransactionType){
        const res=await http.post(`/api/transactions`,transaction)
        return res.data
    },
    async delete(id: number) {
        const res = await http.delete(`/api/transactions/${id}`)
        return res.data
    },
    async getById(id: number) {
        const res = await http.get(`/api/transactions/${id}`)
        return res.data
    },
    async update(transaction: TransactionType, id: number) {
        const res=await http.put(`/api/transactions/${id}`,transaction)
        return res.data
    },
    async getDailyTransactionTotal(day:string){
        const res=await http.get(`/api/transactions/days/${day}`)
        return res.data
    },
    async getPeriodTransactionTotal(startDate:string,endDate:string){
        const res=await http.get(`/api/transactions/periode/${startDate}/${endDate}`)
        return res.data
    }
}