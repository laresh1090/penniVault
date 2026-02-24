<?php

namespace App\Enums;

enum PaymentChannel: string
{
    case Card = 'card';
    case BankTransfer = 'bank_transfer';
    case Wallet = 'wallet';
}
