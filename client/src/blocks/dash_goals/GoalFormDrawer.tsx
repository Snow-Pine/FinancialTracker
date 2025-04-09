import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DrawerFooter, DrawerClose } from "@/components/ui/drawer";

interface GoalFormDrawerProps {
  onSubmit: (newGoal: GoalParams) => void;
}

export function GoalFormDrawer({ onSubmit }: GoalFormDrawerProps) {
  const [newGoal, setNewGoal] = useState<Partial<GoalParams>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if ((name === "currentAmount" || name === "targetAmount") && isNaN(Number(value))) {
      errorMessage = "Please enter a valid number.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    if (!errorMessage) {
      setNewGoal({
        ...newGoal,
        [name]: value,
      });
    }
  };

  const handleDateChange = (date: Date | null) => {
    setNewGoal({
      ...newGoal,
      completionDate: date ? date.toISOString().split("T")[0] : "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error)) {
      alert("Please fix the errors before submitting.");
      return;
    }

    fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGoal),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Newly created goal
        } else {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Failed to create goal");
          });
        }
      })
      .then((createdGoal) => {
        onSubmit(createdGoal); // Pass the new goal to DashboardGoals
        alert("Goal created successfully!");
        navigate("/dashboard?tab=goals"); // Absolute path
      })
      .catch((error) => {
        console.error("Error creating goal:", error);
        alert(error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center">Add New Goal</h2>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <Input
            type="text"
            id="description"
            name="description"
            value={newGoal.description || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium mb-2">
            Target Amount
          </label>
          <Input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={newGoal.targetAmount || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.targetAmount && <p className="text-red-500 text-sm">{errors.targetAmount}</p>}
        </div>

        <div>
          <label htmlFor="currentAmount" className="block text-sm font-medium mb-2">
            Current Amount
          </label>
          <Input
            type="number"
            id="currentAmount"
            name="currentAmount"
            value={newGoal.currentAmount || ""}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.currentAmount && <p className="text-red-500 text-sm">{errors.currentAmount}</p>}
        </div>

        <div>
          <label htmlFor="completionDate" className="block text-sm font-medium mb-2">
            Completion Date
          </label>
          <DatePicker
            selected={newGoal.completionDate ? new Date(newGoal.completionDate) : null}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <DrawerFooter className="flex justify-between">
          <Button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Submit
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </form>
  );
}

export default GoalFormDrawer;