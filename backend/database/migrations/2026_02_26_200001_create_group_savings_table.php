<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('group_savings', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignUlid('created_by_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('contribution_amount', 15, 2);
            $table->string('frequency', 20)->default('monthly');
            $table->unsignedInteger('total_slots');
            $table->unsignedInteger('filled_slots')->default(0);
            $table->unsignedInteger('current_round')->default(0);
            $table->unsignedInteger('total_rounds');
            $table->string('status', 20)->default('pending');
            $table->date('start_date')->nullable();
            $table->date('next_payout_date')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('created_by_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_savings');
    }
};
