<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_investments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('crowd_investment_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->decimal('expected_return', 15, 2);
            $table->decimal('actual_return', 15, 2)->nullable();
            $table->string('status')->default('active');
            $table->timestamp('invested_at');
            $table->timestamp('matured_at')->nullable();
            $table->timestamp('returned_at')->nullable();
            $table->string('reference')->unique();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['crowd_investment_id', 'status']);
            $table->index('status');
            $table->index('reference');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_investments');
    }
};
