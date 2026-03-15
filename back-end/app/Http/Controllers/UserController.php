<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $users = User::with(["branche.ville"])->get();
            if ($users->isEmpty()) {
                return ApiResponse::success([], 'Aucune utilisateur trouvée');
            }
            return ApiResponse::success(
                UserResource::collection($users),
                'Liste des utilisateurs'
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Erreur serveur: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                "cin" => ["required", "string", Rule::unique('adherents', 'cin'), Rule::unique('users', 'cin')],
                "firstName" => "required|string",
                "lastName" => "required|string",
                "adresse" => "required|string",
                "phone" => "required|string",
                "birthDate" => "required|date",
                'imagePath' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                "password" => "required|min:8",
                "gender" => "required",
                "email" => ["required", "email", Rule::unique('adherents', 'email'), Rule::unique('users', 'email')],
                "brancheId" => "required|exists:branches,id",
                "role" => "required|exists:roles,name",
            ], [
                "cin.required" => "Le cin est obligatoire.",
                "cin.string" => "Le cin doit être une chaîne de caractères.",
                "cin.unique" => "Ce cin est déjà utilisé.",

                "firstName.required" => "Le nom est obligatoire.",
                "firstName.string" => "Le nom doit être une chaîne de caractères.",

                "lastName.required" => "Le prénom est obligatoire.",
                "lastName.string" => "Le prénom doit être une chaîne de caractères.",
                "adresse.required" => "Le adresse est obligatoire.",
                "adresse.string" => "L'adresse doit être une chaîne de caractères.",

                "phone.required" => "Le téléphone de l'adhérent est obligatoire.",
                "phone.string" => "Le téléphone  doit être une chaîne de caractères.",
                "birthDate.required" => "Date de naissance est obligatoire.",
                "birthDate.date" => "La date de naissance doit être une date valide.",
                'imagePath.required' => "L'image est obligatoire.",
                'imagePath.image' => 'Le fichier doit être une image valide.',
                'imagePath.mimes' => 'L\'image doit être au format : jpeg, png, jpg ou gif.',
                'imagePath.max' => 'La taille maximale de l\'image est de 2 Mo.',
                "gender.required" => "Le Genre est obligatoire.",
                "email.required" => "Email est obligatoire.",
                'password.min' => 'Le mot de passe doit avoir au moins 8 caractères.',
                "email.email" => "L'adresse email n'est pas valide.",
                "email.unique" => "Cette adresse email est déjà utilisée.",
                "brancheId.required" => "Choissir un club.",
                "brancheId.exists" => "Choissir un club.",
            ]);

            if ($request->filled('password')) {
                $validated['password'] = Hash::make($request->password);
            }

            $user = User::create($validated);
            if ($request->hasFile('imagePath')) {
                $path = $request->file('imagePath')->store('users', 'public');
                $user->imagePath = $path;
                $user->save();
            }

            $user->load("branche");

            $user->syncRoles([$request->role]);

            if ($request->filled('permissions')) {
                $user->syncPermissions($request->permissions);
            } else {
                $user->syncPermissions([]);
            }
            $user->save();
            return ApiResponse::success(new UserResource($user), "Utilisateur ajouté avec succès");
        } catch (ValidationException $e) {
            return ApiResponse::error('Erreur de validation', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $user = User::with(['roles', 'permissions', 'branche.ville'])->find($id);
            if (!$user) {
                return ApiResponse::error("Utilisateur non trouvé", 404);
            }
            return ApiResponse::success(new UserResource($user), "Détails des informations sur l'utilisateur");
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
    public function getUsersByClubId($brancheId)
    {
        try {
            $users = User::with(['roles', 'permissions', 'branche.ville'])->where("brancheId", "=", $brancheId)->get();

            if ($users->isEmpty()) {
                return ApiResponse::success([], 'Aucune utlisateur trouvée');
            }

            return ApiResponse::success(
                UserResource::collection($users),
                "Liste des'utilisateurs"
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Erreur serveur: ' . $e->getMessage(),
                500
            );
        }
    }
    public function updateImage($id, Request $request)
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'imagePath' => 'image|mimes:jpeg,jpg,png,webp|max:2048',
            ], [
                'imagePath.image' => 'Le fichier doit être une image.',
                'imagePath.mimes' => 'L’image doit être au format : jpg, jpeg, png ou webp.',
                'imagePath.max' => 'L’image ne doit pas dépasser 2 Mo.',
            ]);

            if ($user->imagePath && Storage::disk('public')->exists($user->imagePath)) {
                Storage::disk('public')->delete($user->imagePath);
            }

            if ($request->hasFile('imagePath')) {
                $path = $request->file('imagePath')->store('users', 'public');
                $user->imagePath = $path;
                $user->save();
            }

            return ApiResponse::success(
                new UserResource($user),
                'Image mise à jour avec succès.'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Validation errors
            return ApiResponse::error(
                $e,
                422
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Erreur serveur: ' . $e->getMessage(),
                500
            );
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                "cin" => ["required", "string", Rule::unique('adherents', 'cin')->ignore($id), Rule::unique('users', 'cin')->ignore($id)],
                "firstName" => "required|string",
                "lastName" => "required|string",
                "adresse" => "required|string",
                "phone" => "required|string",
                "birthDate" => "required|date",
                // 'imagePath' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                "gender" => "required",
                "email" => ["required", "email", Rule::unique('adherents', 'email')->ignore($id), Rule::unique('users', 'email')->ignore($id)],
                'password' => 'nullable|min:8',
                "brancheId" => "required|exists:branches,id",
            ], [
                "cin.required" => "Le cin est obligatoire.",
                "cin.string" => "Le cin doit être une chaîne de caractères.",
                "cin.unique" => "Ce cin est déjà utilisé.",

                "firstName.required" => "Le nom est obligatoire.",
                "firstName.string" => "Le nom doit être une chaîne de caractères.",

                "lastName.required" => "Le prénom est obligatoire.",
                "lastName.string" => "Le prénom doit être une chaîne de caractères.",
                "adresse.required" => "Le adresse est obligatoire.",
                "adresse.string" => "L'adresse doit être une chaîne de caractères.",

                "phone.required" => "Le téléphone de l'adhérent est obligatoire.",
                "phone.string" => "Le téléphone  doit être une chaîne de caractères.",
                "birthDate.required" => "Date de naissance est obligatoire.",
                "birthDate.date" => "La date de naissance doit être une date valide.",
                // 'imagePath.image' => 'Le fichier doit être une image valide.',
                // 'imagePath.mimes' => 'L\'image doit être au format : jpeg, png, jpg ou gif.',
                // 'imagePath.max' => 'La taille maximale de l\'image est de 2 Mo.',
                "gender.required" => "Le Genre est obligatoire.",
                "email.required" => "Email est obligatoire.",
                'password.min' => 'Le mot de passe doit avoir au moins 8 caractères.',
                "email.email" => "L'adresse email n'est pas valide.",
                "email.unique" => "Cette adresse email est déjà utilisée.",
                "brancheId.required" => "Choissir un club.",
                "brancheId.exists" => "Choissir un club",
            ]);
            $user = User::findOrFail($id);
            if ($request->filled('password')) {
                $validated['password'] = Hash::make($request->password);
            } else {
                unset($validated['password']);
            }
            $user->update($validated);
            $user->syncRoles([$request->role]);
            if ($request->filled('permissions')) {
                $user->syncPermissions($request->permissions);
            }
            $user->load("branche");

            // if ($request->hasFile('imagePath')) {
            //     if ($user->imagePath && Storage::disk('public')->exists($user->imagePath)) {
            //         Storage::disk('public')->delete($user->imagePath);
            //     }
            //     $path = $request->file('imagePath')->store('users', 'public');
            //     $user->imagePath = asset('storage/' . $path);
            // }

            $user->save();
            return ApiResponse::success(new UserResource($user), "Modifié avec succès");
        } catch (ValidationException $e) {
            return ApiResponse::error('Erreur de validation', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
    public function destroy(string $id)
    {
        try {
            $user = User::findOrFail($id);
            if (!$user) {
                return ApiResponse::error("Impossible de supprimer ce utilisateur : elle n’existe pas", 404);
            }
            if ($user->imagePath && Storage::disk('public')->exists($user->imagePath)) {
                Storage::disk('public')->delete($user->imagePath);
            }
            $user->syncRoles([]);
            $user->syncPermissions([]);
            $user->delete();
            return ApiResponse::success(null, 'Utilisateur supprimé avec succès');
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
}
