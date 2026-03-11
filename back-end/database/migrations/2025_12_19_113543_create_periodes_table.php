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
        Schema::create('periodes', function (Blueprint $table) {
            $table->id();
            $table->integer("durationDays");
            $table->decimal("price", 10, 2);
            $table->decimal("remainingAmount",10,2);
            $table->date("startDate");
            $table->date("endDate");
            $table->foreignId("adherentId")->nullable()->references("id")->on("adherents")->onDelete("set null");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('periodes');
    }
};
