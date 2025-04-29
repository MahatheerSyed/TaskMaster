import { useState } from "react";
import { Task } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import PriorityBadge from "./priority-badge";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { updateTaskMutation } = useTasks();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusToggle = async () => {
    try {
      setIsUpdating(true);
      await updateTaskMutation.mutateAsync({
        id: task.id,
        data: {
          ...task,
          completed: !task.completed
        }
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const createdDate = new Date(task.createdAt);
  const formattedDate = format(createdDate, "MMM d, yyyy");

  return (
    <Card className={`overflow-hidden border ${task.completed ? 'border-primary-300 bg-primary-50' : 'border-gray-200'}`}>
      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 flex items-start pt-1">
          <Checkbox
            checked={task.completed}
            disabled={isUpdating}
            className={`h-6 w-6 rounded-full ${task.completed ? 'bg-primary-500 border-primary-500' : 'border-gray-300'}`}
            onCheckedChange={handleStatusToggle}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 
              className={`text-lg font-medium truncate ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}
            >
              {task.title}
            </h3>
            
            <div className="ml-2 flex-shrink-0">
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
          
          <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            {task.description || 'No description'}
          </p>
          
          <div className="flex items-center text-xs text-gray-500">
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center sm:self-start">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-gray-500 p-1"
            onClick={() => onEdit(task)}
          >
            <span className="sr-only">Edit</span>
            <Edit className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-2 text-gray-400 hover:text-gray-500 p-1"
            onClick={() => onDelete(task.id)}
          >
            <span className="sr-only">Delete</span>
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
