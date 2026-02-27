<?php

namespace App\Enums;

enum PayoutStatus: string
{
    case Pending = 'pending';
    case Current = 'current';
    case Completed = 'completed';
}
