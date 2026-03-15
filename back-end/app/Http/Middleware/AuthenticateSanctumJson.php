<?php

namespace App\Http\Middleware;

use App\Helpers\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class AuthenticateSanctumJson
{
    public function handle(Request $request, Closure $next)
    {
        $request->headers->set('Accept', 'application/json');
        $token = $request->bearerToken() ?? $request->cookie('token');
        if (!$token) {
            return ApiResponse::error(
                'Token requis',
                401,
                ['token' => ['Token requis']]
            );
        }
        $accessToken = PersonalAccessToken::findToken($token);
        if (!$accessToken) {
            return ApiResponse::error(
                'Utilisateur non authentifié',
                401,
                ['token' => ['Token invalide ou expirée']]
            );
        }
        if ($accessToken->expires_at->isPast()) {
            return ApiResponse::error(
                'Utilisateur non authentifié',
                401,
                ['token' => ['Token expiré']]
            );
        }
        if (!$accessToken->tokenable) {
            return ApiResponse::error(
                'Utilisateur non authentifié',
                401,
                ['token' => ['Token invalide']]
            );
        }
        $request->setUserResolver(function () use ($accessToken) {
            return $accessToken->tokenable;
        });

        return $next($request);
    }
}
