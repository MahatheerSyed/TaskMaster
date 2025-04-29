import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/hooks/use-tasks";
import { Task } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LogOut, PlusCircle, Search } from "lucide-react";
import TaskCard from "@/components/ui/task-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskForm from "@/components/ui/task-form";
import ConfirmDeleteDialog from "@/components/ui/confirm-dialog";
import { filterTasks, searchTasks, sortByDate, sortByPriority } from "@/lib/utils";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { tasks, isLoading, deleteTaskMutation } = useTasks();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<"all" | "active" | "completed">("all");
  const [sortBy, setSortBy] = useState<"date" | "priority">("date");
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  
  // Apply filters, search, and sorting
  let filteredTasks = filterTasks(tasks, currentFilter);
  filteredTasks = searchTasks(filteredTasks, searchQuery);
  filteredTasks = sortBy === "priority" 
    ? sortByPriority(filteredTasks) 
    : sortByDate(filteredTasks);
  
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };
  
  const handleAddTask = () => {
    setSelectedTask(undefined);
    setIsTaskModalOpen(true);
  };
  
  const handleDeleteTask = (taskId: number) => {
    setTaskToDelete(taskId);
  };
  
  const confirmDeleteTask = async () => {
    if (taskToDelete !== null) {
      await deleteTaskMutation.mutateAsync(taskToDelete);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-primary-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">TaskMaster</span>
              </div>
            </div>
            
            <div className="flex items-center">
              {user && (
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                    <span>{user.name.charAt(0)}</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{user.name}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2 text-gray-500"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <LogOut className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Task Controls */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
              <p className="text-gray-600">
                {filteredTasks.length} {currentFilter === 'all' ? 'tasks' : currentFilter === 'active' ? 'active tasks' : 'completed tasks'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..." 
                  className="pl-10"
                />
              </div>
              
              <Button 
                onClick={handleAddTask}
                className="inline-flex items-center"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="mb-6 flex justify-between items-center">
            <div className="inline-flex rounded-md shadow-sm">
              <Button 
                onClick={() => setCurrentFilter("all")} 
                variant={currentFilter === "all" ? "secondary" : "outline"}
                className="rounded-l-md rounded-r-none"
              >
                All
              </Button>
              <Button 
                onClick={() => setCurrentFilter("active")} 
                variant={currentFilter === "active" ? "secondary" : "outline"}
                className="rounded-none border-l-0 border-r-0"
              >
                Active
              </Button>
              <Button 
                onClick={() => setCurrentFilter("completed")} 
                variant={currentFilter === "completed" ? "secondary" : "outline"}
                className="rounded-r-md rounded-l-none"
              >
                Completed
              </Button>
            </div>
            
            <div className="inline-flex rounded-md shadow-sm">
              <Button 
                onClick={() => setSortBy("priority")} 
                variant={sortBy === "priority" ? "secondary" : "outline"}
                className="rounded-l-md rounded-r-none"
              >
                By Priority
              </Button>
              <Button 
                onClick={() => setSortBy("date")} 
                variant={sortBy === "date" ? "secondary" : "outline"}
                className="rounded-r-md rounded-l-none"
              >
                By Date
              </Button>
            </div>
          </div>
          
          {/* Task List */}
          <div className="mt-6 space-y-4">
            {isLoading && tasks.length === 0 && (
              <div className="animate-pulse space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            )}
            
            {!isLoading && filteredTasks.length === 0 && (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {currentFilter === 'all' && "Get started by creating a new task."}
                  {currentFilter === 'active' && "You don't have any active tasks."}
                  {currentFilter === 'completed' && "You haven't completed any tasks yet."}
                </p>
                <div className="mt-6">
                  <Button onClick={handleAddTask}>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>
            )}
            
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Task Modal */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask ? "Edit Task" : "Add New Task"}</DialogTitle>
          </DialogHeader>
          <TaskForm 
            task={selectedTask} 
            onClose={() => setIsTaskModalOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={taskToDelete !== null}
        isLoading={deleteTaskMutation.isPending}
        onClose={() => setTaskToDelete(null)}
        onConfirm={confirmDeleteTask}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500">&copy; 2023 TaskMaster. All rights reserved.</p>
            </div>
            <div className="mt-4 flex justify-center md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Privacy Policy</span>
                <span className="text-sm">Privacy Policy</span>
              </a>
              <span className="mx-2 text-gray-400">|</span>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Terms of Service</span>
                <span className="text-sm">Terms of Service</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
