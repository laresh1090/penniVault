import type { FAQItem, FAQCategory } from "@/types/marketing";

export const faqCategories: FAQCategory[] = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "savings", label: "Savings" },
  { id: "groups", label: "Group Savings" },
  { id: "wallet", label: "Wallet" },
];

export const faqItems: FAQItem[] = [
  {
    id: 1,
    category: "general",
    question: "What is PenniVault?",
    answer: "PenniVault is a smart savings platform that combines goal-based savings plans, group savings (Ajo/Esusu), and a vendor marketplace — all in one platform designed for Nigerians who want to save intentionally and acquire assets.",
  },
  {
    id: 2,
    category: "general",
    question: "Is PenniVault free to use?",
    answer: "Yes! Creating an account and using basic savings features is completely free. We only charge small, transparent fees for bank withdrawals and premium features. There are no hidden charges.",
  },
  {
    id: 3,
    category: "savings",
    question: "How do goal-based savings plans work?",
    answer: "You set a savings target, choose a timeline and contribution frequency (daily, weekly, or monthly). PenniVault tracks your progress and you can earn up to 8% annual interest on your savings. You can link your plan to a specific product in our marketplace.",
  },
  {
    id: 4,
    category: "savings",
    question: "Can I withdraw from a savings plan early?",
    answer: "It depends on your plan type. Fixed savings plans have a lock-in period to help you stay disciplined. Flexible plans allow early withdrawal, but you may forfeit any earned interest. We encourage completing your plan for maximum benefit.",
  },
  {
    id: 5,
    category: "groups",
    question: "What is the midpoint turn model?",
    answer: "The midpoint turn model is our innovative approach to group savings (Ajo). Payouts begin at the 50% mark of total contribution cycles, ensuring the savings pool has sufficient funds before any member receives their payout. This protects all members and builds trust.",
  },
  {
    id: 6,
    category: "groups",
    question: "How do I join or create a savings group?",
    answer: "To create a group, go to your dashboard and click 'Create Group.' Set the contribution amount, frequency, and number of members. To join an existing group, use the invite link or group code shared by the group creator. Both options are available after KYC verification.",
  },
  {
    id: 7,
    category: "wallet",
    question: "What's the difference between Real and Virtual Wallet?",
    answer: "Your Real Wallet holds actual deposited funds — money you've added via bank transfer or card. Your Virtual Wallet tracks group savings entitlements — the amount you're entitled to receive from group savings. Virtual funds become real when it's your turn for a payout.",
  },
  {
    id: 8,
    category: "general",
    question: "How secure is my money on PenniVault?",
    answer: "Your money is protected with bank-grade encryption, two-factor authentication (2FA), and mandatory KYC verification. All transactions are logged and auditable. We partner with licensed financial institutions to hold your funds securely.",
  },
  {
    id: 9,
    category: "general",
    question: "What is KYC and why is it required?",
    answer: "KYC (Know Your Customer) is a verification process required by Nigerian financial regulations. It involves confirming your identity with a valid ID and personal details. This protects you from fraud, prevents money laundering, and ensures the safety of all users on the platform.",
  },
  {
    id: 10,
    category: "wallet",
    question: "How do I deposit or withdraw funds?",
    answer: "To deposit, go to your Wallet page and click 'Deposit.' You can fund your wallet via bank transfer, debit card, or USSD. For withdrawals, click 'Withdraw' and enter the amount — funds are sent to your linked bank account within 24 hours.",
  },
];
