<?php

namespace App\Enums;

enum InstallmentPlanStatus: string
{
    case Active = 'active';
    case Completed = 'completed';
    case Overdue = 'overdue';
    case Defaulted = 'defaulted';
    case Cancelled = 'cancelled';
}
