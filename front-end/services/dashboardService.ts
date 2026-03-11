import http from "@/lib/api/http"

export const DashboardService={
    async getDashboardStats(){
        const res=await http.get("/api/dashboard")
        return res.data
    }
}