import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth to handle authentication
import { PageLoader } from "@/components/ui/page-loader.tsx";

interface EditGoalDrawerProps {
  goal: GoalParams;
  onSubmit: (updatedGoal: GoalParams) => void;
}

export function EditGoalDrawer({ goal, onSubmit }: EditGoalDrawerProps) {
  const [updatedGoal, setUpdatedGoal] = useState(goal);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth(); // Get authentication status

  useEffect(() => {
    setUpdatedGoal((prevGoal) => ({
      ...prevGoal,
      ...goal,
    }));

    if (!isAuthenticated && !loading) {
      window.location.href = `${import.meta.env.VITE_SERVER_URL}/login`; // Redirect to login if not authenticated
    }
  }, [goal, isAuthenticated, loading]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (updatedGoal.targetAmount < 0 || isNaN(Number(updatedGoal.targetAmount))) {
      newErrors.targetAmount = "Target amount must be a non-negative number.";
    }
    if (updatedGoal.currentAmount < 0 || isNaN(Number(updatedGoal.currentAmount))) {
      newErrors.currentAmount = "Current amount must be a non-negative number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedGoal({
      ...updatedGoal,
      [name]: value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    setUpdatedGoal({
      ...updatedGoal,
      completionDate: date ? date.toISOString().split("T")[0] : "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/goals/${updatedGoal._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedGoal),
    })
      .then((response) => {
        if (response.ok) {
          onSubmit(updatedGoal);
          alert("Goal edited successfully!");
          navigate("/dashboard?tab=goals");
        } else {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Failed to update goal");
          });
        }
      })
      .catch((error) => {
        console.error("Error updating goal:", error);
        alert(error.message);
      });
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center">Edit Goal</h2>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <Input
            type="text"
            id="description"
            name="description"
            value={updatedGoal.description}
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
            value={updatedGoal.targetAmount}
            onChange={handleChange}
            required
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.targetAmount ? "border-red-500" : "focus:ring-blue-500"
            }`}
          />
          {errors.targetAmount && <p className="text-red-500 text-sm mt-1">{errors.targetAmount}</p>}
        </div>

        <div>
          <label htmlFor="currentAmount" className="block text-sm font-medium mb-2">
            Current Amount
          </label>
          <Input
            type="number"
            id="currentAmount"
            name="currentAmount"
            value={updatedGoal.currentAmount}
            onChange={handleChange}
            required
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.currentAmount ? "border-red-500" : "focus:ring-blue-500"
            }`}
          />
          {errors.currentAmount && <p className="text-red-500 text-sm mt-1">{errors.currentAmount}</p>}
        </div>

        <div>
          <label htmlFor="completionDate" className="block text-sm font-medium mb-2">
            Completion Date
          </label>
          <DatePicker
            selected={updatedGoal.completionDate ? new Date(updatedGoal.completionDate) : null}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select completion date"
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

export default EditGoalDrawer;
