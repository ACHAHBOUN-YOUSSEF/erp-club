import { http } from "@/lib/api/http"
import { userType } from "@/lib/validators/users"
export const userService = {
    async getAll() {
        const res = await http.get("/api/users")
        return res.data
    },
    async getById(id: number) {
        const res = await http.get(`/api/users/${id}`)
        return res.data
    },
    async getImageUrl(id: number) {
        const res = await http.get(`/api/users/images/${id}`)
        return res.data
    },
    async UpdateImageUser(id: number, image: FormData) {
        const res = await http.post(`/api/users/${id}/update-image`, image, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return res.data
    }
    ,
    async getUsersByClubsId(brancheId: number) {
        const res = await http.get(`/api/users/clubs/${brancheId}`)
        return res.data
    },
    async create(user: userType) {
        const res = await http.post("/api/users", user, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return res.data
    },
    async update(id: number, user: userType) {
        const res = await http.put(`/api/users/${id}`, user);
        return res.data;
    },

    async delete(id: number) {
        const res = await http.delete(`/api/users/${id}`)
        return res.data
    }
}