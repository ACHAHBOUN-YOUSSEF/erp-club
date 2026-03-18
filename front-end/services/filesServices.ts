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
    async DownloadRecuSubscription(subscriptionId:number){
        const response = await http.get(`/api/adherents/subscriptions/${subscriptionId}/recus`, { responseType: "blob" })
        return response
    },
    async DownloadAllUsersAsExcelFile(){
        const response=await http.get("/api/adherents/download/allAsExcel",{responseType:"blob"})
        return response
    }
};
