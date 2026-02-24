<?php

namespace App\Enums;

enum ListingCategory: string
{
    case Property = 'property';
    case Automotive = 'automotive';
    case Agriculture = 'agriculture';
    case Other = 'other';
}
