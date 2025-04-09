const express = require("express");
const Goal = require("../models/goals");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");

// Route to get all goals
router.get("/", requiresAuth(), (req, res) => {
    Goal.find({ createdBy: req.oidc.user.sub })
        .then((goals) => {
            res.json(goals);
        })
        .catch((err) => {
            res.status(500).send({ message: "Error fetching goals", error: err.message });
        });
});

// POST route to add a goal to the database
router.post("/", requiresAuth(), (req, res) => {
    const { description, targetAmount, currentAmount, completionDate } = req.body;

    const newGoal = new Goal({
        description,
        targetAmount,
        currentAmount,
        completionDate,
        createdBy: req.oidc.user.sub,
    });

    newGoal
    .save()
    .then((savedGoal) => {
        res.status(201).json(savedGoal);
    })
    .catch((err) => {
        res.status(400).json({ message: "Failed to add goal", error: err.message });
    });
});

// PUT route to update a goal in the database
router.put("/:id", (req, res) => {
    Goal.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedGoal) => {
            if (!updatedGoal) {
                return res.status(404).send({ message: "Goal not found" });
            }
            res.json(updatedGoal);
        })
        .catch((err) => {
            res.status(500).send({ message: "Error updating goal", error: err.message });
        });
});

// DELETE route to remove a goal from the database
router.delete("/:id", (req, res) => {
    Goal.findByIdAndDelete(req.params.id)
        .then((deletedGoal) => {
            if (!deletedGoal) {
                return res.status(404).send({ message: "Goal not found" });
            }
            res.json(deletedGoal);
        })
        .catch((err) => {
            res.status(500).send({ message: "Error deleting goal", error: err.message });
        });
});

module.exports = router;