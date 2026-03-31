<?php

namespace App\Exports\Adherents;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ExportByFilters implements FromCollection, WithHeadings, WithMapping, WithColumnWidths
{
    protected $adherents;
    public function __construct($adherents)
    {
        $this->adherents = $adherents;
    }
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return collect($this->adherents);
    }
    public function headings(): array
    {
        return [
            'ID',
            'CIN',
            'Nom Complet',
            'Tel',
            'Date inscription',
            'genre'
        ];
    }
    public function columnWidths(): array
    {
        return [
            'A' => 21,
            'B' => 21,
            'C' => 21,
            'D' => 21,
            'E' => 21,
            'F' => 21,
        ];
    }
    public function map($adherent): array
    {
        return [
            $adherent->id,
            $adherent->cin ?? "----",
            $adherent->firstName . " " . $adherent->lastName,
            $adherent->phonePrimary,
            $adherent->registrationDate,
            $adherent->gender ?? "----",
        ];
    }
}
