<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->boolean('allow_installment')->default(false)->after('metadata');
            $table->decimal('min_upfront_percent', 5, 2)->default(40.00)->after('allow_installment');
            $table->decimal('installment_markup_6m', 5, 2)->default(5.00)->after('min_upfront_percent');
            $table->decimal('installment_markup_12m', 5, 2)->default(10.00)->after('installment_markup_6m');
        });
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn([
                'allow_installment',
                'min_upfront_percent',
                'installment_markup_6m',
                'installment_markup_12m',
            ]);
        });
    }
};
