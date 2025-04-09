import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import GoalFormDrawer from "@/blocks/dash_goals/GoalFormDrawer";
import EditGoalDrawer from "@/blocks/dash_goals/EditGoalDrawer";
import { ProgressBar } from "@/blocks/dash_goals/ProgressBar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth hook
import {PageLoader} from "@/components/ui/page-loader.tsx";
import '@/styles/GoalList.css';

const DashboardGoals: React.FC = () => {
  const [goals, setGoals] = useState<GoalParams[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<GoalParams | null>(null);
  const [isAddDrawerOpen, setAddDrawerOpen] = useState(false);
  const { loading } = useAuth(); // Use the authentication hook

  // Fetch Goals for the authenticated user
  const fetchGoals = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/goals`, {
        credentials: "include",
      });
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };


  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dashboard/goals/${id}`, { method: "DELETE" });
      if (response.ok) {
        setGoals(goals.filter((goal) => goal._id !== id));
      } else {
        const errorData = await response.json();
        console.error("Error deleting goal:", errorData.message || "Unknown error");
        alert("Failed to delete goal: " + errorData.message);
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert("An error occurred while deleting the goal.");
    }
  };

  const handleAddGoal = (newGoal: GoalParams) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
    setAddDrawerOpen(false);
  };

  const handleEditGoal = (goal: GoalParams) => {
    setSelectedGoal(goal);
  };

  const handleGoalSubmit = (updatedGoal: GoalParams) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => (goal._id === updatedGoal._id ? updatedGoal : goal))
    );
    setSelectedGoal(null);
  };

  const calculateCountdown = (targetDate: string): string => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const distance = target - now;

    if (distance < 0) {
      return "Completed";
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    return `${days} days remaining`;
  };

  const calculateProgress = (currentAmount: number, targetAmount: number): number => {
    return targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
  };

  if (loading) {
    return <PageLoader />; 
    }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Your Goals</h1>
        <Drawer open={isAddDrawerOpen} onOpenChange={setAddDrawerOpen}>
          <DrawerTrigger asChild>
            <Button onClick={() => setAddDrawerOpen(true)}>Add new goal</Button>
          </DrawerTrigger>
          <DrawerContent>
            <GoalFormDrawer
              onSubmit={(newGoal) => {
                handleAddGoal(newGoal);
              }}
            />
          </DrawerContent>
        </Drawer>
      </div>

      <div className="grid gap-4 grid-cols-1">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.currentAmount || 0, goal.targetAmount || 0);

          return (
            <Card key={goal._id} className="col-span-1 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex-grow">
                  <CardHeader>
                    <CardTitle>{goal.description}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Target Amount:</strong> ${Number(goal.targetAmount || 0).toFixed(2)}
                    </p>
                    <p>
                      <strong>Current Amount:</strong> ${Number(goal.currentAmount || 0).toFixed(2)}
                    </p>
                    <p>
                      <strong>Progress:</strong> {progress.toFixed(2)}%
                    </p>
                    <div className="progress-bar">
                      <ProgressBar progress={progress} />
                    </div>
                    <p>
                      <strong>Target Completion Date:</strong> {new Date(goal.completionDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Countdown:</strong> {calculateCountdown(goal.completionDate)}
                    </p>
                  </CardContent>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="outline" onClick={() => handleEditGoal(goal)}>
                        Edit
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <VisuallyHidden>
                        <h2>Edit Goal</h2>
                      </VisuallyHidden>
                      {selectedGoal && selectedGoal._id === goal._id && (
                        <EditGoalDrawer
                          goal={selectedGoal}
                          onSubmit={(updatedGoal) => {
                            handleGoalSubmit(updatedGoal);
                            setSelectedGoal(null);
                          }}
                        />
                      )}
                    </DrawerContent>
                  </Drawer>
                  <Button onClick={() => handleDelete(goal._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardGoals;
