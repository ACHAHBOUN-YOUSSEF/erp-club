<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class Permissions2Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $permissions=[
        //     "export_adherents",
        //     "filter_adherents",
        //     "view_logs",
        //     "download_adherents",
        //     "view_transactions",
        // ];
        $permissions=[
            "view_outils"
        ];
        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }
            // Role::firstOrCreate(['name' => 'Commerciale', 'guard_name' => 'web']);

    }
}
