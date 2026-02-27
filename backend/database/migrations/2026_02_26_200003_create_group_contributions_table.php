<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('group_contributions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('group_savings_id')->constrained('group_savings')->cascadeOnDelete();
            $table->foreignUlid('group_member_id')->constrained('group_members')->cascadeOnDelete();
            $table->unsignedInteger('round');
            $table->decimal('amount', 15, 2);
            $table->string('status', 20)->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->foreignUlid('transaction_id')->nullable()->constrained('transactions')->nullOnDelete();
            $table->timestamps();

            $table->unique(['group_member_id', 'round']);
            $table->index(['group_savings_id', 'round']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_contributions');
    }
};
