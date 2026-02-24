<?php

namespace App\Console\Commands;

use App\Services\SavingsService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class AccrueInterestCommand extends Command
{
    protected $signature = 'savings:accrue-interest
                            {--date= : Specific date to accrue for (Y-m-d). Defaults to today.}';

    protected $description = 'Accrue daily interest for all active savings plans with interest enabled.';

    public function __construct(
        private readonly SavingsService $savingsService,
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $date = $this->option('date')
            ? Carbon::parse($this->option('date'))
            : Carbon::today();

        $this->info("Accruing interest for: {$date->toDateString()}");

        $result = $this->savingsService->accrueInterestForAllPlans($date);

        $this->info("Processed: {$result['processed']} plans");
        $this->info("Accrued: {$result['accrued']} plans");
        $this->info("Total interest: ₦" . number_format($result['total_interest'], 2));

        return Command::SUCCESS;
    }
}
