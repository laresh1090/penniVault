<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('group_payouts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('group_savings_id')->constrained('group_savings')->cascadeOnDelete();
            $table->foreignUlid('group_member_id')->constrained('group_members')->cascadeOnDelete();
            $table->unsignedInteger('round');
            $table->decimal('amount', 15, 2);
            $table->string('status', 20)->default('pending');
            $table->date('expected_date')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->foreignUlid('transaction_id')->nullable()->constrained('transactions')->nullOnDelete();
            $table->timestamps();

            $table->unique(['group_savings_id', 'round']);
            $table->index('group_member_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_payouts');
    }
};
