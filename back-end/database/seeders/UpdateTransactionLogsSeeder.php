<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\User;

class UpdateTransactionLogsSeeder extends Seeder
{
    public function run(): void
    {
        Transaction::whereNull('executedByUser')
            ->chunk(100, function ($transactions) {

                foreach ($transactions as $transaction) {

                    $user = User::find($transaction->executedByUserId);

                    if ($user) {
                        $role = $user->getRoleNames()->first();

                        $transaction->update([
                            'executedByUser' =>
                                $role . ' - ' .
                                $user->firstName . ' ' .
                                $user->lastName
                        ]);
                    }
                }
            });
    }
}