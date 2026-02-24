<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interest_accruals', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('savings_plan_id')->constrained()->cascadeOnDelete();
            $table->date('accrual_date');
            $table->decimal('principal', 15, 2);
            $table->decimal('annual_rate', 5, 2);
            $table->decimal('daily_amount', 15, 2);
            $table->decimal('cumulative_interest', 15, 2);
            $table->timestamps();

            $table->unique(['savings_plan_id', 'accrual_date']);
            $table->index('accrual_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interest_accruals');
    }
};
