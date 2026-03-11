import { http } from "@/lib/api/http"
type props = {
    email: string,
    password: string
}
export const AuthService = {
    async login({ email, password }: props) {
        const res = await http.post("/api/login", { email: email, password: password })
        return res.data
    },
    async logout() {
        const res = await http.post(`/api/logout`)
        return res.data
    },
    async me() {
        const res = await http.get('/api/me'); 
        return res.data;
    }
}