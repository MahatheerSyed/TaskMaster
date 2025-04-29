import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateTaskSchema, InsertTask, Task } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useTasks } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  completed: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function TaskForm({ task, onClose }: TaskFormProps) {
  const { toast } = useToast();
  const { createTaskMutation, updateTaskMutation } = useTasks();
  
  const isEditing = !!task;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      priority: (task?.priority as "Low" | "Medium" | "High") || "Medium",
      completed: task?.completed || false,
    },
  });
  
  const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending;

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditing && task) {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          data: data
        });
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        await createTaskMutation.mutateAsync(data);
        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Task description" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  className={`flex-1 ${
                    field.value === "Low"
                      ? "bg-green-100 border-green-300 text-green-800"
                      : "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200"
                  }`}
                  variant="outline"
                  onClick={() => form.setValue("priority", "Low")}
                >
                  Low
                </Button>
                <Button
                  type="button"
                  className={`flex-1 ${
                    field.value === "Medium"
                      ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                      : "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200"
                  }`}
                  variant="outline"
                  onClick={() => form.setValue("priority", "Medium")}
                >
                  Medium
                </Button>
                <Button
                  type="button"
                  className={`flex-1 ${
                    field.value === "High"
                      ? "bg-red-100 border-red-300 text-red-800"
                      : "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200"
                  }`}
                  variant="outline"
                  onClick={() => form.setValue("priority", "High")}
                >
                  High
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {isEditing && (
          <FormField
            control={form.control}
            name="completed"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm text-gray-600">
                  {field.value ? "Completed" : "Active"}
                </FormLabel>
              </FormItem>
            )}
          />
        )}
        
        <div className="flex space-x-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              isEditing ? "Update Task" : "Add Task"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
