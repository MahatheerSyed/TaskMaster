import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Task, UpdateTask } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useTasks() {
  const { user } = useAuth();
  
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    enabled: !!user,
  });
  
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<Task, "id" | "userId" | "createdAt">) => {
      const res = await apiRequest("POST", "/api/tasks", newTask);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateTask }) => {
      const res = await apiRequest("PUT", `/api/tasks/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });
  
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });
  
  return {
    tasks,
    isLoading,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
}
