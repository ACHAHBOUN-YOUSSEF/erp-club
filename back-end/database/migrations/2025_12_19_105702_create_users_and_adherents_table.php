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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string("cin")->unique()->nullable();
            $table->string("firstName");
            $table->string("lastName");
            $table->string("phonePrimary");
            $table->date("birthDate")->nullable();
            $table->string("gender")->nullable();
            $table->string("adresse")->nullable();
            $table->string("imagePath")->nullable();
            $table->foreignId("brancheId")->nullable()->references("id")->on("branches")->onDelete("set null");
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
        Schema::create('adherents', function (Blueprint $table) {
            $table->id();
            $table->string("cin")->unique()->nullable();
            $table->string("firstName");
            $table->string("lastName");
            $table->string("phonePrimary");
            $table->string("phoneSecondary")->nullable();
            $table->date("birthDate")->nullable();
            $table->string("gender")->nullable();
            $table->string("adresse")->nullable();
            $table->string("email")->unique();
            $table->string("password")->nullable();
            $table->date("registrationDate");
            $table->date("insuranceEndDate");
            $table->decimal("insuranceRemainingAmount", 10, 2)->nullable();
            $table->string("imagePath")->nullable();
            $table->string("profession")->nullable();
            $table->foreignId("brancheId")->nullable()->references("id")->on("branches")->onDelete("set null");
            $table->foreignId("addedByUserId")->nullable()->references("id")->on("users")->onDelete("set null");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
   public function down(): void
{
    Schema::dropIfExists('adherents');
    Schema::dropIfExists('sessions');
    Schema::dropIfExists('password_reset_tokens');
    Schema::dropIfExists('users');
}

};
