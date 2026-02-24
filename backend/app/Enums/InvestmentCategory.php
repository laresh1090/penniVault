<?php

namespace App\Enums;

enum InvestmentCategory: string
{
    case Agriculture = 'agriculture';
    case RealEstate = 'real_estate';
    case Technology = 'technology';
    case Other = 'other';
}
