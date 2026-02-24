<?php

namespace App\Enums;

enum TransactionType: string
{
    case Deposit = 'deposit';
    case Withdrawal = 'withdrawal';
    case Transfer = 'transfer';
    case SavingsContribution = 'savings_contribution';
    case SavingsPayout = 'savings_payout';
    case SavingsInterest = 'savings_interest';
    case Commission = 'commission';
    case GroupContribution = 'group_contribution';
    case GroupPayout = 'group_payout';
    case Investment = 'investment';
    case InvestmentReturn = 'investment_return';
    case Penalty = 'penalty';
    case Purchase = 'purchase';
    case Sale = 'sale';
    case InstallmentUpfront = 'installment_upfront';
    case InstallmentPayment = 'installment_payment';
}
