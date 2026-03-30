<?php

use App\Http\Middleware\AuthenticateSanctumJson;
use Illuminate\Support\Facades\Route;

Route::middleware(AuthenticateSanctumJson::class)->group(function () {
    Route::fallback(function () {
        return response()->json([
            "success" => false,
            "message" => "API Route not found"
        ], 404);
    });
});
