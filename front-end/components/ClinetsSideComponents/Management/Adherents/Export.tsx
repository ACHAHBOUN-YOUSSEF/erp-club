"use client";

import Spinner from "@/components/ui/spinner";
import { downloadBlob } from "@/helpers/helpers";
import { FilesService } from "@/services/filesServices";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
    const [isBusy, setIsBusy] = useState(false);
    const [filters, setFilters] = useState({
        dateType: "none",
        specificDate: "",
        dateFrom: "",
        dateTo: "",
        gender: "all",
        status: "all"
    });

    function handleChange(e: any) {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        setIsBusy(true);

        try {
            const response = await FilesService.DownloadUsersByFilters(filters)
            let filename = `adherents.xlsx`
            downloadBlob(response.data, filename);
            toast.success('File téléchargé !');
        } catch (err) {
            toast.error('Probléme téléchargement');
        } finally {
            setIsBusy(false);
        }
    }

    return (
        <div className="bg-white dark:bg-black m-4 p-4 rounded-2xl shadow-lg border border-red-200">
            {isBusy && <Spinner />}
            <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
                {/* DATE */}
                <fieldset className="border border-red-300 rounded-xl p-4">
                    <legend className="px-2 text-red-600 font-semibold">
                        Date ou Période
                    </legend>

                    <div className="flex flex-col gap-3 mt-2">

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="dateType"
                                value="none"
                                checked={filters.dateType === "none"}
                                onChange={handleChange}
                            />
                            Sans Date
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="dateType"
                                value="specific"
                                checked={filters.dateType === "specific"}
                                onChange={handleChange}
                            />
                            Date spécifique
                            <input
                                type="date"
                                name="specificDate"
                                disabled={filters.dateType !== "specific"}
                                value={filters.specificDate}
                                onChange={handleChange}
                                className="border rounded px-2 py-1"
                            />
                        </label>

                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="dateType"
                                    value="period"
                                    checked={filters.dateType === "period"}
                                    onChange={handleChange}
                                />
                                Période
                            </label>

                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    name="dateFrom"
                                    disabled={filters.dateType !== "period"}
                                    value={filters.dateFrom}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1"
                                />
                                <input
                                    type="date"
                                    name="dateTo"
                                    disabled={filters.dateType !== "period"}
                                    value={filters.dateTo}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1"
                                />
                            </div>
                        </div>

                    </div>
                </fieldset>

                {/* GENRE */}
                <fieldset className="border border-red-300 rounded-xl p-4">
                    <legend className="px-2 text-red-600 font-semibold">
                        Genre
                    </legend>

                    <div className="flex flex-col gap-3 mt-2">
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="HOMME"
                                checked={filters.gender === "HOMME"}
                                onChange={handleChange}
                            /> Homme
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="FEMME"
                                checked={filters.gender === "FEMME"}
                                onChange={handleChange}
                            /> Femme
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="all"
                                checked={filters.gender === "all"}
                                onChange={handleChange}
                            /> Tous
                        </label>
                    </div>
                </fieldset>

                {/* STATUS */}
                {/* <fieldset className="border border-red-300 rounded-xl p-4">
                    <legend className="px-2 text-red-600 font-semibold">
                        Status
                    </legend>

                    <div className="flex flex-col gap-3 mt-2">
                        <label>
                            <input
                                type="radio"
                                name="status"
                                value="active"
                                checked={filters.status === "active"}
                                onChange={handleChange}
                            /> Actifs
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="status"
                                value="inactive"
                                checked={filters.status === "inactive"}
                                onChange={handleChange}
                            /> Inactifs
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="status"
                                value="all"
                                checked={filters.status === "all"}
                                onChange={handleChange}
                            /> Tous
                        </label>
                    </div>
                </fieldset> */}

                {/* BUTTON */}
                <div className="md:col-span-3">
                    <button
                        type="submit"
                        className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                    >
                        Exporter
                    </button>
                </div>

            </form>
        </div>
    );
}