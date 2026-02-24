<?php

namespace App\Enums;

enum InvestmentStatus: string
{
    case Open = 'open';
    case Funded = 'funded';
    case InProgress = 'in_progress';
    case Matured = 'matured';
    case Cancelled = 'cancelled';
}
