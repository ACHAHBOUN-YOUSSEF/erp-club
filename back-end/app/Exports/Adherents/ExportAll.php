<?php

namespace App\Exports\Adherents;

use App\Models\Adherent;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ExportAll implements  FromCollection, WithHeadings, WithMapping,WithColumnWidths
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Adherent::with('addedBy')->orderBy('id', 'desc')->select("id", "cin", "firstName", "lastName", "gender", "phonePrimary", "registrationDate")->get();
    }
    public function columnWidths(): array
    {
        return [
            'A' => 21,
            'B' => 21,
            'C' => 21,
            'D' => 21,
            'E' => 21,
        ];
    }
    public function headings(): array
    {
        return [
            'ID',
            'Cin',
            'Nom Complet',
            'Genre',
            'Télephone',
            'D.inscription',
        ];
    }
    public function map($adherent): array
    {
        return [
            $adherent->id,
            $adherent->cin??"----",
            $adherent->firstName . " " . $adherent->lastName,
            $adherent->gender??"----",
            $adherent->phonePrimary,    
            $adherent->registrationDate,
        ];
    }
}
