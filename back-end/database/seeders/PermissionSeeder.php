<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'view_dashboard',
            'view_adherents',
            'view_profile_adherents',
            'create_adherents',
            'edit_adherents',
            'delete_adherents',

            'view_subscriptions',
            'create_subscriptions',
            'edit_subscriptions',
            'delete_subscriptions',
            'download_contrat_subscriptions',
            'download_recu_subscriptions',
            'download_facture_subscriptions',

            'create_periodes',
            'edit_periodes',
            'delete_periodes',

            'create_transactions',
            'edit_transactions',
            'delete_transactions',
            'download_recu_transactions',

            'view_users',
            'create_users',
            'edit_users',
            'edit_users_image',
            'delete_users',

            'view_abonnements',
            'create_abonnements',
            'edit_abonnements',
            'delete_abonnements',

            'create_groupe_abonnements',
            'edit_groupe_abonnements',
            'delete_groupe_abonnements',
            'view_settings',
            'view_Monitoring',
            'view_mode-dev',
            'view_access-control',
        ];
        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }
    }
}
