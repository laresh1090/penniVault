<?php

namespace App\Enums;

enum BusinessType: string
{
    case Property = 'property';
    case Automotive = 'automotive';
    case Retail = 'retail';
    case Other = 'other';
}
