<?php

use Illuminate\Support\Facades\Schedule;

// Run daily at 1:00 AM WAT (West Africa Time)
Schedule::command('savings:accrue-interest')->dailyAt('01:00');
Schedule::command('savings:mature-plans')->dailyAt('01:05');
Schedule::command('installments:check-overdue')->dailyAt('01:10');
