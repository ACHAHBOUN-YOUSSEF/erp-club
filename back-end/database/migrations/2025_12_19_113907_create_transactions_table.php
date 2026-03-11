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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string("type");
            $table->decimal("montant", 10, 2);
            $table->string("description");
            $table->string("modePaiement");
            $table->longText("imagePath");
            $table->date("transactionDate");
            $table->foreignId("targetAdherentId")->nullable()->references("id")->on("adherents")->onDelete("set null");
            $table->foreignId("executedByUserId")->nullable()->references("id")->on("users")->onDelete("set null");
            $table->foreignId("brancheId")->nullable()->references("id")->on("branches")->onDelete("set null");
            $table->foreignId("subscriptionsId")->nullable()->references("id")->on("subscriptions")->onDelete("set null");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
