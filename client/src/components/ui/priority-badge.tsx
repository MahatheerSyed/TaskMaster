import { Badge } from "@/components/ui/badge";

interface PriorityBadgeProps {
  priority: string;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  let color;
  
  switch (priority) {
    case 'Low':
      color = 'bg-green-100 text-green-800';
      break;
    case 'Medium':
      color = 'bg-yellow-100 text-yellow-800';
      break;
    case 'High':
      color = 'bg-red-100 text-red-800';
      break;
    default:
      color = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <Badge variant="outline" className={`${color} rounded-full font-medium`}>
      {priority}
    </Badge>
  );
}
