<?php
// app/Http/Controllers/AuthController.php
namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            // return response()->json($request->email);
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ], [
                'email.required' => 'Email obligatoire.',
                'email.email' => 'Email invalide.',
                'password.required' => 'Mot de passe obligatoire.',
            ]);

            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['Les identifiants fournis sont invalides.'],
                ]);
            }

            $token = $user->createToken(
                'api-token',
                ['*'],
                now()->addMinutes(120)
            )->plainTextToken;
            // $response=ApiResponse::success([
            return ApiResponse::success([
                'token' => $token,
                'expiresAt' => now()->addMinutes(60),
                'user' => new UserResource($user)
            ], 'Connexion réussie');
            // return $response->cookie('auth_token', $token, 60,'/', null,true,true);
        } catch (ValidationException $e) {

            return ApiResponse::error(
                'Erreur de validation',
                422,
                $e->errors()
            );
        } catch (\Exception $e) {

            return ApiResponse::error(
                'Erreur serveur',
                500
            );
        }
    }
    public function me(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return ApiResponse::error(
                    'Utilisateur non authentifié',
                    401,
                    ['token' => ['Token invalide ou expiré']]
                );
            }
            $user=User::with(['roles', 'permissions', 'branche.ville'])->find($user->id);
            return ApiResponse::success([
                'token' => $request->bearerToken(),
                'expiresAt' => $user->tokens()->first()?->expires_at ?? now()->addMinutes(60),
                'user' => new UserResource($user)
            ], 'Profil récupéré avec succès');
        } catch (ValidationException $e) {
            return ApiResponse::error(
                'Erreur de validation',
                422,
                $e->errors()
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Erreur serveur',
                500
            );
        }
    }
}
