<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Full = 'full';
    case Installment = 'installment';
}
