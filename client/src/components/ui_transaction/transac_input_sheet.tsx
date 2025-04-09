import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { DatePicker } from "./date_picker";
import { AccountCombobox } from "./account_combobox";
import { CategoryCombobox } from "./category_combobox";
import { Transactions } from "./types";

interface InputSheetProps {
  onNewTransaction: (transaction: Transactions) => void;
  transactionToEdit?: Transactions | null | undefined;
  isEditing?: boolean;
  onClose?: () => void;
  modifiedDoc: boolean;
  setModifiedDoc: (value: boolean) => void;
}

export function InputSheet({
  onNewTransaction,
  transactionToEdit,
  isEditing,
  onClose,
  // modifiedDoc,
  setModifiedDoc,
}: InputSheetProps) {
  const [date, setDate] = useState("");
  const [account, setAccount] = useState<"saving" | "checking">("checking");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  // Set initial values if editing an existing transaction
  useEffect(() => {
    if (transactionToEdit) {
      const adjustedDate = new Date(transactionToEdit.date);
      adjustedDate.setMinutes(adjustedDate.getMinutes() + adjustedDate.getTimezoneOffset());
      setDate(adjustedDate.toISOString().split('T')[0]);
      setAccount(transactionToEdit.account);
      setCategory(transactionToEdit.category);
      setDescription(transactionToEdit.description);
      setAmount(transactionToEdit.amount.toString());
    }
  }, [transactionToEdit]);

  console.log("transactionToEdit", transactionToEdit);
  console.log("isEditing", isEditing);
  console.log("date to be by sheet", date);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTransaction = {
      date,
      account,
      category,
      description,
      amount: parseFloat(amount),
    };

    try {
      console.log("isEditing:", isEditing);
      console.log("transactionToEdit:", transactionToEdit);
      console.log("newTransaction:", newTransaction);

      // Determine URL and method for the request
      const url = isEditing && transactionToEdit
        ? `${import.meta.env.VITE_SERVER_URL}/user/transactions/${transactionToEdit._id}`
        : `${import.meta.env.VITE_SERVER_URL}/user/transactions`;
      const method = isEditing && transactionToEdit ? "PUT" : "POST";

      console.log(`Sending ${method} request to ${url}`);
      console.log("Request body:", newTransaction);

      // Sending request
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error("Failed to save transaction");
      }

      const savedTransaction = await response.json();
      onNewTransaction(savedTransaction);

      // Close the sheet only after saving the transaction
      console.log("Onclose", onClose);
      if (onClose) onClose();
      setModifiedDoc(false);
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <Sheet open={isEditing} onOpenChange={onClose}>
      <SheetTrigger asChild>
        <Button variant="outline">{isEditing ? "Edit Transaction" : "Add new transaction"}</Button>
      </SheetTrigger>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Transaction" : "New Transaction"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Modify transaction information below. Click save to complete."
              : "Input transaction information below. Click save to complete."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <DatePicker onChange={setDate} value={date} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account" className="text-right">
                Account
              </Label>
              <div className="col-span-3">
                <AccountCombobox onChange={setAccount} value={account} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <CategoryCombobox onChange={setCategory} value={category} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                className="col-span-3 border-solid"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                className="col-span-3 border-solid"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}