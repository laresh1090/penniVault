<?php

namespace App\Console\Commands;

use App\Services\InstallmentService;
use Illuminate\Console\Command;

class CheckOverdueInstallments extends Command
{
    protected $signature = 'installments:check-overdue';

    protected $description = 'Check for overdue installment payments and update statuses';

    public function handle(InstallmentService $installmentService): int
    {
        $count = $installmentService->checkOverdue();

        $this->info("Marked {$count} payment(s) as overdue.");

        return self::SUCCESS;
    }
}
