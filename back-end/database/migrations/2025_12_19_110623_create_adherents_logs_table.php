<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('adherents_logs', function (Blueprint $table) {
            $table->id();
            $table->string("action");
            $table->string("fieldName")->nullable();
            $table->string("oldValue")->nullable();
            $table->string("newValue")->nullable();
            $table->string("description")->nullable();
            $table->foreignId("executedByUserId")->nullable()->references("id")->on("users")->onDelete("set null");
            $table->foreignId("targetAdherentId")->nullable()->references("id")->on("adherents")->onDelete("set null");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adherents_logs');
    }
};
