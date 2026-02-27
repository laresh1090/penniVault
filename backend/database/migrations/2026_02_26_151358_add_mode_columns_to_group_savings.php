<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('group_savings', function (Blueprint $table) {
            $table->string('mode', 10)->default('peer')->after('status');
            $table->foreignUlid('vendor_id')->nullable()->after('mode')->constrained('users')->nullOnDelete();
            $table->foreignUlid('listing_id')->nullable()->after('vendor_id')->constrained('listings')->nullOnDelete();
            $table->decimal('product_price', 15, 2)->nullable()->after('listing_id');
            $table->decimal('payout_start_percent', 5, 2)->nullable()->after('product_price');
            $table->decimal('freeze_payout_until_percent', 5, 2)->nullable()->after('payout_start_percent');

            $table->index('mode');
        });

        Schema::table('group_payouts', function (Blueprint $table) {
            $table->decimal('real_amount', 15, 2)->nullable()->after('amount');
            $table->decimal('virtual_amount', 15, 2)->nullable()->after('real_amount');
        });
    }

    public function down(): void
    {
        Schema::table('group_savings', function (Blueprint $table) {
            $table->dropForeign(['vendor_id']);
            $table->dropForeign(['listing_id']);
            $table->dropIndex(['mode']);
            $table->dropColumn(['mode', 'vendor_id', 'listing_id', 'product_price', 'payout_start_percent', 'freeze_payout_until_percent']);
        });

        Schema::table('group_payouts', function (Blueprint $table) {
            $table->dropColumn(['real_amount', 'virtual_amount']);
        });
    }
};
