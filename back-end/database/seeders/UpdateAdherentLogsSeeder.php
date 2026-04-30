<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdherentLog;
use App\Models\User;

class UpdateAdherentLogsSeeder extends Seeder
{
    public function run(): void
    {
        $logs = AdherentLog::whereNull('executedByUser')->get();

        foreach ($logs as $log) {
            $user = User::find($log->executedByUserId);

            if ($user) {
                $role = $user->getRoleNames()->first();
                $log->update(['executedByUser' => $role . ' - ' . $user->firstName . ' ' . $user->lastName]);
            }
        }
    }
}