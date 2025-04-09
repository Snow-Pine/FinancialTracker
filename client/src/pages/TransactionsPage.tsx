import { useEffect, useState } from "react";
import { format } from "date-fns";
import { columns } from "../components/ui_transaction/columns";
import { Transactions } from "../components/ui_transaction/types";
import { DataTable } from "../components/ui_transaction/data-table";
import { InputSheet } from "../components/ui_transaction/transac_input_sheet";
import DeleteConfirmationPopover from "../components/ui/delete_confirmation_pop_over";
import {PageLoader} from "@/components/ui/page-loader.tsx"; // Adjust the path accordingly

async function getData(): Promise<Transactions[]> {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/transactions`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data: Transactions[] = await response.json();
  return data;
}

const TransactionsPage: React.FC = () => {
  const [data, setData] = useState<Transactions[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopover, setShowPopover] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transactions | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transactions | null>(null);
  const [modifiedDoc, setModifiedDoc] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData();
        const formattedData = result.map((transaction) => ({
          ...transaction,
          date: format(new Date(transaction.date), "yyyy-MM-dd"),
        }));
        setData(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditTransaction = (transaction: Transactions) => {
    setTransactionToEdit(transaction);
    setIsEditing(true);
    setModifiedDoc(true);
  };

  const handleNewTransaction = (newTransaction: Transactions) => {
    const formattedTransaction = {
      ...newTransaction,
      date: format(new Date(newTransaction.date), "yyyy-MM-dd"),
    };

    if (isEditing && transactionToEdit) {
      setData((prevData) =>
        prevData.map((transaction) =>
          transaction._id === transactionToEdit._id ? formattedTransaction : transaction
        )
      );
      setIsEditing(false);
      setTransactionToEdit(null);
      setModifiedDoc(false);
    } else {
      setData((prevData) => [...prevData, formattedTransaction]);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTransaction) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/transactions/${selectedTransaction._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      setData((prevData) =>
        prevData.filter(
          (transaction) => transaction._id !== selectedTransaction._id
        )
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setShowPopover(false);
      setSelectedTransaction(null);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  console.log("isEditing:", isEditing);

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        onNewTransaction={handleNewTransaction}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={(transaction) => {
          setSelectedTransaction(transaction);
          setShowPopover(true);
        }}
      />
      <InputSheet
        onNewTransaction={handleNewTransaction}
        transactionToEdit={transactionToEdit}
        isEditing={isEditing}
        onClose={() => {
          setIsEditing(false);
          setModifiedDoc(false);
        }}
        modifiedDoc={modifiedDoc}
        setModifiedDoc={setModifiedDoc}
      />
      {showPopover && (
        <DeleteConfirmationPopover
          onConfirm={handleDelete}
          onCancel={() => setShowPopover(false)}
        />
      )}
    </div>
  );
};

export default TransactionsPage;