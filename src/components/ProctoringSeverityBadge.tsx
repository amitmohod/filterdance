
import React from 'react';
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, XCircle } from 'lucide-react';

type SeverityLevel = 'low' | 'medium' | 'high' | 'none';

interface ProctoringSeverityBadgeProps {
  severity: SeverityLevel;
  count?: number;
  className?: string;
}

const severityConfig = {
  none: {
    color: 'bg-gray-100 text-gray-500',
    icon: Info,
    label: 'No Violations'
  },
  low: {
    color: 'bg-severity-low/10 text-severity-low border-severity-low/20',
    icon: Info,
    label: 'Low Severity'
  },
  medium: {
    color: 'bg-severity-medium/10 text-severity-medium border-severity-medium/20',
    icon: AlertTriangle,
    label: 'Medium Severity'
  },
  high: {
    color: 'bg-severity-high/10 text-severity-high border-severity-high/20',
    icon: XCircle,
    label: 'High Severity'
  }
};

export const ProctoringSeverityBadge = ({ 
  severity, 
  count = 0,
  className 
}: ProctoringSeverityBadgeProps) => {
  const config = severityConfig[severity];
  const Icon = config.icon;
  
  return (
    <div 
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-all",
        config.color,
        className
      )}
    >
      <Icon size={14} className="mr-1.5" />
      {count > 0 ? `${count} Violations` : config.label}
    </div>
  );
};

export default ProctoringSeverityBadge;
