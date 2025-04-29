import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTaskSchema, updateTaskSchema, tasks } from "@shared/schema";

// Authentication middleware to check if user is logged in
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Task routes
  app.get("/api/tasks", isAuthenticated, async (req, res) => {
    try {
      const tasks = await storage.getTasks(req.user!.id);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/tasks/:id", isAuthenticated, async (req, res) => {
    try {
      const task = await storage.getTask(parseInt(req.params.id));
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Check if task belongs to the authenticated user
      if (task.userId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/tasks", isAuthenticated, async (req, res) => {
    try {
      const validatedTask = insertTaskSchema.parse({
        ...req.body, 
        userId: req.user!.id
      });
      
      const task = await storage.createTask(validatedTask);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/tasks/:id", isAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const existingTask = await storage.getTask(taskId);
      
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Check if task belongs to the authenticated user
      if (existingTask.userId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const validatedTask = updateTaskSchema.parse(req.body);
      const updatedTask = await storage.updateTask(taskId, validatedTask);
      
      res.json(updatedTask);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/tasks/:id", isAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const existingTask = await storage.getTask(taskId);
      
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Check if task belongs to the authenticated user
      if (existingTask.userId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteTask(taskId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
