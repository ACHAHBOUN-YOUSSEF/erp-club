<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 1️⃣ Créer les permissions
        $permissions = [
            'create-post',
            'edit-post',
            'delete-post',
            'view-post',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        // 2️⃣ Créer les rôles
        $roles = [
            'admin' => $permissions,        // admin a toutes les permissions
            'user' => ['create-post','edit-post','view-post'],
            'viewer' => ['view-post'],
        ];

        foreach ($roles as $roleName => $rolePerms) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($rolePerms); // assigne les permissions
        }

        // 3️⃣ Assigner un rôle à un utilisateur
        $user = User::first(); // récupère le premier utilisateur
        if($user){
            $user->assignRole('admin'); // assigne le rôle 'admin'
            // Les permissions sont déjà incluses via le rôle
        }
    }
}
