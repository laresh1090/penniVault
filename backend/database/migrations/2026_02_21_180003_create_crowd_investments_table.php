<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crowd_investments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('vendor_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category');
            $table->decimal('target_amount', 15, 2);
            $table->decimal('current_amount', 15, 2)->default(0.00);
            $table->decimal('minimum_investment', 15, 2);
            $table->decimal('expected_roi_percent', 5, 2);
            $table->unsignedInteger('duration_days');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status')->default('open');
            $table->json('images')->nullable();
            $table->string('location')->nullable();
            $table->string('risk_level');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['vendor_id', 'status']);
            $table->index(['category', 'status']);
            $table->index('status');
            $table->index('risk_level');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crowd_investments');
    }
};
