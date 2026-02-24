<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('savings_plans', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('product_type');
            $table->decimal('target_amount', 15, 2);
            $table->decimal('current_amount', 15, 2)->default(0.00);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('frequency');
            $table->decimal('contribution_amount', 15, 2);
            $table->string('status')->default('active');
            $table->string('linked_asset_id')->nullable();
            $table->boolean('has_interest')->default(false);
            $table->decimal('interest_rate', 5, 2)->nullable();
            $table->decimal('accrued_interest', 15, 2)->default(0.00);
            $table->boolean('is_fixed_term')->default(false);
            $table->decimal('early_withdrawal_penalty_percent', 5, 2)->default(0.00);
            $table->date('last_interest_accrual_date')->nullable();
            $table->timestamp('matured_at')->nullable();
            $table->timestamp('broken_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'product_type']);
            $table->index(['user_id', 'status']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('savings_plans');
    }
};
