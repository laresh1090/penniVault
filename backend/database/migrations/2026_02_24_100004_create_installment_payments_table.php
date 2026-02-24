<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('installment_payments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('installment_plan_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('payment_number');
            $table->decimal('amount', 15, 2);
            $table->date('due_date');
            $table->timestamp('paid_at')->nullable();
            $table->string('status')->default('pending');
            $table->foreignUlid('transaction_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->index(['installment_plan_id', 'status']);
            $table->index(['due_date', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('installment_payments');
    }
};
