import { TransactionType } from "@/lib/validators/transactions";
import Link from "next/link";

type Props = {
    transactions: TransactionType[];
    info: string | undefined;
}

export const TransactionCards = ({ transactions, info }: Props) => {
    const total = transactions.reduce((acc, transaction) =>
        acc + parseFloat(transaction.montant || '0'), 0
    );
    const count = transactions.length;
    const moyenne = total / count;

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
        return (
            <div className="text-center py-12 mt-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-4 sm:p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <span className="text-2xl text-gray-400">📋</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune transaction</h3>
                <p className="text-gray-500 text-sm sm:text-base">Sélectionnez une date pour voir les transactions</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-600 to-red-700 mt-2 text-white p-4 sm:p-6 rounded-xl shadow-lg">
                <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 md:items-center">
                    <div className="text-center md:text-left">
                        <p className="text-xs sm:text-sm opacity-90 mb-2">{info}</p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold">{count} transactions</p>
                    </div>
                    <div className="text-center">
                        <p className="text-base sm:text-lg opacity-90">Total du jour</p>
                        <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-1 leading-tight">
                            {total.toLocaleString('fr-FR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })} DH
                        </p>
                    </div>

                    {/* Colonne 3 - Moyenne */}
                    <div className="text-center md:text-right">
                        <p className="text-xs sm:text-sm opacity-90 mb-2">Moyenne par transaction</p>
                        <p className="text-lg sm:text-xl font-semibold">
                            {moyenne.toLocaleString('fr-FR', {
                                minimumFractionDigits: 2
                            })} DH
                        </p>
                    </div>
                </div>
            </div>

            {/* Cards transactions - MOBILE FRIENDLY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {transactions.map((transaction, index) => {
                    const formattedDate = new Date(transaction.transactionDate).toLocaleDateString('fr-FR');
                    const isEdited = transaction.created_at !== transaction.updated_at;

                    return (
                        <div key={transaction.id || index} className="bg-gray-50 border-l-4 border-red-600 shadow-md rounded-xl p-3 sm:p-5 hover:shadow-lg transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-2 gap-2 sm:gap-0">
                                <div className="w-full sm:w-auto">
                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">{formattedDate}</p>
                                    <Link
                                        href={`/adherents/${(transaction as any).targetAdherentId}/fiche`}
                                        className="font-semibold text-black hover:text-red-700 hover:underline transition-colors text-sm sm:text-base block truncate"
                                    >
                                        {(transaction as any).firstName || 'N/A'} {(transaction as any).lastName || ''}
                                    </Link>
                                </div>
                                <span className="text-base sm:text-lg font-bold text-red-700 text-center sm:text-right">
                                    {parseFloat(transaction.montant || '0').toLocaleString()} DH
                                </span>
                            </div>

                            <div className="text-gray-700 text-xs sm:text-sm space-y-1.5">
                                <p className="truncate" title={transaction.description}><strong>Description :</strong> {transaction.description || 'N/A'}</p>
                                <p><strong>Date :</strong> {transaction.transactionDate}</p>
                                <p><strong>Mdde de paiement :</strong> {transaction.modePaiement || 'N/A'}</p>
                                <p><strong>Via :</strong> {(transaction as any).userFirstName ?? 'Système'} {(transaction as any).userLastName ?? ''}</p>

                                {isEdited && (
                                    <span className="inline-block mt-2 text-xs text-yellow-800 bg-yellow-100 rounded-full px-2 py-1 font-medium">
                                        Éditée
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
