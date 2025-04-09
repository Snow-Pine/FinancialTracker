export interface Transactions {
    _id: string;
    date: string;
    account: "saving" | "checking";
    category: "retail" | "personal" | "transportation" | "restaurant" | "health" | "other" | "salary";
    description: string;
    amount: number;
    createdBy: string;
    createdAt?: string;
  }