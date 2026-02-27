<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $adebayo = User::where('email', 'adebayo@test.com')->firstOrFail();
        $chidinma = User::where('email', 'chidinma@test.com')->firstOrFail();

        // Adebayo's notifications
        $this->createNotifications($adebayo->id, [
            ['title' => 'Deposit Successful', 'message' => 'Your deposit of ₦250,000 has been credited to your wallet.', 'type' => 'payment', 'action_url' => '/wallet', 'ago_days' => 0],
            ['title' => 'PenniSave Auto-Debit', 'message' => 'Your daily PenniSave contribution of ₦5,000 was deducted from your wallet.', 'type' => 'savings', 'action_url' => '/savings', 'ago_days' => 1],
            ['title' => 'Installment Due Soon', 'message' => 'Your next installment payment of ₦3,258,333 for Lekki Apartment is due in 5 days.', 'type' => 'payment', 'action_url' => '/installments', 'ago_days' => 2],
            ['title' => 'PenniLock Matured', 'message' => 'Your PenniLock plan "Emergency Fund" has matured. ₦550,000 + ₦12,500 interest is now in your wallet.', 'type' => 'success', 'action_url' => '/savings', 'ago_days' => 3],
            ['title' => 'Investment Returns', 'message' => 'Your Golden Acres Farm investment has generated ₦45,000 in returns this quarter.', 'type' => 'success', 'action_url' => '/investments', 'ago_days' => 5],
            ['title' => 'Welcome to PenniVault', 'message' => 'Your account has been verified. Start saving and investing today!', 'type' => 'info', 'is_read' => true, 'ago_days' => 30],
            ['title' => 'TargetSave Milestone', 'message' => 'You\'ve reached 75% of your "New iPhone" savings goal. Keep going!', 'type' => 'savings', 'action_url' => '/savings', 'ago_days' => 7],
            ['title' => 'Withdrawal Processed', 'message' => 'Your withdrawal of ₦100,000 to GTBank ****6789 has been processed.', 'type' => 'payment', 'is_read' => true, 'action_url' => '/wallet', 'ago_days' => 10],
        ]);

        // Chidinma's notifications
        $this->createNotifications($chidinma->id, [
            ['title' => 'Installment Payment Overdue', 'message' => 'Your installment payment for Mercedes C300 is overdue. Please make payment to avoid penalties.', 'type' => 'warning', 'action_url' => '/installments', 'ago_days' => 0],
            ['title' => 'Deposit Successful', 'message' => 'Your deposit of ₦150,000 has been credited to your wallet.', 'type' => 'payment', 'action_url' => '/wallet', 'ago_days' => 1],
            ['title' => 'PenniSave Created', 'message' => 'Your new PenniSave plan "Monthly Savings" has been created. Auto-debit starts tomorrow.', 'type' => 'success', 'action_url' => '/savings', 'ago_days' => 4],
            ['title' => 'Welcome to PenniVault', 'message' => 'Your account has been verified. Start saving and investing today!', 'type' => 'info', 'is_read' => true, 'ago_days' => 15],
        ]);
    }

    private function createNotifications(string $userId, array $items): void
    {
        foreach ($items as $item) {
            Notification::create([
                'user_id' => $userId,
                'title' => $item['title'],
                'message' => $item['message'],
                'type' => $item['type'],
                'is_read' => $item['is_read'] ?? false,
                'action_url' => $item['action_url'] ?? null,
                'created_at' => now()->subDays($item['ago_days'])->subHours(rand(0, 12)),
                'updated_at' => now()->subDays($item['ago_days'])->subHours(rand(0, 12)),
            ]);
        }
    }
}
