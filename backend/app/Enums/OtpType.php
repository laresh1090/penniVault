<?php

namespace App\Enums;

enum OtpType: string
{
    case EmailVerification = 'email_verification';
    case Login = 'login';
}
