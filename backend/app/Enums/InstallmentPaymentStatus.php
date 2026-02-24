<?php

namespace App\Enums;

enum InstallmentPaymentStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Overdue = 'overdue';
    case Failed = 'failed';
}
