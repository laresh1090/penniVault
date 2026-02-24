<?php

namespace App\Enums;

enum SavingsProductType: string
{
    case PenniSave = 'pennisave';
    case PenniLock = 'pennilock';
    case TargetSave = 'targetsave';
    case PenniAjo = 'penniajo';
}
