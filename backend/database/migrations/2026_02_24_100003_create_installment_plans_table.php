<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('installment_plans', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('order_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('total_amount', 15, 2);
            $table->decimal('upfront_amount', 15, 2);
            $table->decimal('upfront_percent', 5, 2);
            $table->decimal('remaining_amount', 15, 2);
            $table->decimal('markup_percent', 5, 2)->default(0);
            $table->decimal('markup_amount', 15, 2)->default(0);
            $table->decimal('monthly_amount', 15, 2);
            $table->unsignedTinyInteger('number_of_payments');
            $table->unsignedTinyInteger('payments_completed')->default(0);
            $table->date('next_payment_due_at')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('status');
            $table->index('next_payment_due_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('installment_plans');
    }
};
