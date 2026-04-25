<?php

namespace App\Exports\Transactions;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class All implements FromCollection, WithHeadings, WithMapping, WithColumnWidths
{
    protected $transactions;
    public function __construct($transactions)
    {
        $this->transactions = $transactions;
    }
    public function collection()
    {
        return collect($this->transactions);
    }
    public function headings(): array
    {
        return [
            'Adhérent',
            'Montant',
            'Date de transaction',
            'Description',
            'mode de paiement',
            'Via',

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
    public function map($transaction): array
    {
        return [
            $transaction->montant,
            $transaction->firstName . " " . $transaction->lastName,
            $transaction->transactionDate,
            $transaction->description,
            $transaction->modePaiement,
            $transaction->userFirstName . " " . $transaction->userLastName,
        ];
    }
}
