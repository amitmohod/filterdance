
import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ViolationIcon } from './ViolationIcon';

type Violation = {
  type: 'window' | 'image' | 'time' | 'headphones' | 'cellphone' | 'other';
  count: number;
  severity: 'low' | 'medium' | 'high';
  details?: string;
};

interface ProctoringViolationsProps {
  violations: Violation[];
  className?: string;
}

export const ProctoringViolations = ({ violations, className }: ProctoringViolationsProps) => {
  if (!violations.length) {
    return (
      <div className={cn("flex items-center justify-center py-2 text-muted-foreground text-sm", className)}>
        No violations
      </div>
    );
  }

  // Group violations by type
  const groupedViolations = violations.reduce((acc, violation) => {
    if (!acc[violation.type]) {
      acc[violation.type] = {
        count: 0,
        highestSeverity: 'low' as 'low' | 'medium' | 'high',
        details: []
      };
    }
    
    acc[violation.type].count += violation.count;
    
    // Update to highest severity
    const severityRank = { low: 1, medium: 2, high: 3 };
    if (severityRank[violation.severity] > severityRank[acc[violation.type].highestSeverity]) {
      acc[violation.type].highestSeverity = violation.severity;
    }
    
    if (violation.details) {
      acc[violation.type].details.push(violation.details);
    }
    
    return acc;
  }, {} as Record<string, { count: number; highestSeverity: 'low' | 'medium' | 'high'; details: string[] }>);

  return (
    <div className={cn("flex items-center gap-2 py-1", className)}>
      <TooltipProvider delayDuration={300}>
        {Object.entries(groupedViolations).map(([type, data]) => (
          <Tooltip key={type}>
            <TooltipTrigger asChild>
              <div className="relative">
                <ViolationIcon 
                  type={type as any} 
                  severity={data.highestSeverity} 
                  size={20}
                  className="transition-all hover:scale-110"
                />
                {data.count > 1 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-3.5 h-3.5 text-[8px] font-bold bg-white text-foreground rounded-full border border-border shadow-sm">
                    {data.count}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom"
              align="center" 
              className="bg-white border shadow-md p-2 rounded-md max-w-[220px]"
            >
              <div className="text-xs space-y-1">
                <div className="font-medium flex items-center gap-1.5">
                  <ViolationIcon type={type as any} severity={data.highestSeverity} size={12} />
                  <span>
                    {type.charAt(0).toUpperCase() + type.slice(1)} Violation
                    {data.count > 1 ? `s (${data.count})` : ''}
                  </span>
                </div>
                {data.details.length > 0 && (
                  <p className="text-muted-foreground text-[10px]">
                    {data.details.join(', ')}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default ProctoringViolations;
