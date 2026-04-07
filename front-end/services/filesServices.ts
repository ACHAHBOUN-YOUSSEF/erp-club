import http from '@/lib/api/http';

export const FilesService = {
    async DownloadRecu(transactionId: number) {
        const response = await http.get(`/api/adherents/transactions/${transactionId}/recus`, { responseType: 'blob' });
        return response;
    },
    async DownloadContrant(subscriptionId: number) {
        const response = await http.get(`/api/adherents/subscriptions/${subscriptionId}/contrats`, { responseType: "blob" })
        return response
    },
    async DownloadFacture(factureId: number) {
        const response = await http.get(`/api/adherents/subscriptions/${factureId}/factures`, { responseType: "blob" })
        return response
    },
    async DownloadRecuPeriode(periodeId: number) {
        const response = await http.get(`/api/adherents/periodes/${periodeId}/recus`, { responseType: "blob" })
        return response
    },
    async DownloadRecuSubscription(subscriptionId: number) {
        const response = await http.get(`/api/adherents/subscriptions/${subscriptionId}/recus`, { responseType: "blob" })
        return response
    },
    async DownloadAllUsersAsExcelFile() {
        const response = await http.get("/api/adherents/download/allAsExcel", { responseType: "blob" })
        return response
    },
    async DownloadUsersByFilters(filters: any) {
        const res = await http.post("/api/adherents/download/filters", filters, { responseType: "blob" })
        return res
    },
    async downloadActiveAdherents() {
        const res = await http.get("/api/adherents/status/actifs/download", { responseType: "blob" })
        return res
    },
    async downloadInActiveAdherents() {
        const res = await http.get("/api/adherents/status/inactifs/download", { responseType: "blob" })
        return res
    },
    async downloadAdherentsHasRemainingAmount() {
        const res = await http.get("/api/adherents/status/HasRemainingAmount/download", { responseType: "blob" })
        return res
    }
};
