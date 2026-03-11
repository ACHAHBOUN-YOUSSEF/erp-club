import { http } from "@/lib/api/http"

export const RolesPermissionsService={
    async getRolesAndPermissions(){
        const res=await http.get("/api/roles-permissions")
        return res.data
    }
}