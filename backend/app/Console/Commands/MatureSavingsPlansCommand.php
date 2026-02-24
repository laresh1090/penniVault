<?php

namespace App\Console\Commands;

use App\Services\SavingsService;
use Illuminate\Console\Command;

class MatureSavingsPlansCommand extends Command
{
    protected $signature = 'savings:mature-plans';

    protected $description = 'Mature PenniLock plans that have reached their end date and pay out interest.';

    public function __construct(
        private readonly SavingsService $savingsService,
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $this->info('Checking for plans to mature...');

        $count = $this->savingsService->matureEligiblePlans();

        $this->info("Matured: {$count} plans");

        return Command::SUCCESS;
    }
}
