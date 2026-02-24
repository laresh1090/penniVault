<?php

namespace App\Enums;

enum UserInvestmentStatus: string
{
    case Active = 'active';
    case Matured = 'matured';
    case Cancelled = 'cancelled';
    case Returned = 'returned';
}
