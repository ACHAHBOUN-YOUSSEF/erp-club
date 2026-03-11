<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\RolePermissionResource;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{
    public function index()
    {
        try {
            $roles = Role::select("name")->get();
            $permissions = Permission::select("name")->get(); 
            return ApiResponse::success(
                new RolePermissionResource([
                    'roles' => $roles,
                    'permissions' => $permissions,
                ]), 
                "Rôles et Droits d'accès"
            );
        } catch (\Throwable $th) {
            return ApiResponse::error('Erreur serveur: ' . $th->getMessage(), 500);
        }
    }
}
