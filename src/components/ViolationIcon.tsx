
import React from 'react';
import { 
  MonitorOff, 
  Camera, 
  Clock, 
  Headphones, 
  Smartphone,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViolationType = 
  | 'window' 
  | 'image' 
  | 'time' 
  | 'headphones' 
  | 'cellphone'
  | 'other';

interface ViolationIconProps {
  type: ViolationType;
  severity?: 'low' | 'medium' | 'high';
  className?: string;
  size?: number;
}

const violationConfig = {
  window: {
    icon: MonitorOff,
    color: {
      low: 'text-severity-low',
      medium: 'text-severity-medium',
      high: 'text-severity-high',
    }
  },
  image: {
    icon: Camera,
    color: {
      low: 'text-severity-low',
      medium: 'text-severity-medium',
      high: 'text-severity-high',
    }
  },
  time: {
    icon: Clock,
    color: {
      low: 'text-severity-low',
      medium: 'text-severity-medium',
      high: 'text-severity-high',
    }
  },
  headphones: {
    icon: Headphones,
    color: {
      low: 'text-severity-low',
      medium: 'text-severity-medium',
      high: 'text-severity-high',
    }
  },
  cellphone: {
    icon: Smartphone,
    color: {
      low: 'text-severity-low',
      medium: 'text-severity-medium',
      high: 'text-severity-high',
    }
  },
  other: {
    icon: AlertTriangle,
    color: {
      low: 'text-severity-low',
      medium: 'text-severity-medium',
      high: 'text-severity-high',
    }
  }
};

export const ViolationIcon = ({ 
  type, 
  severity = 'medium',
  className,
  size = 16
}: ViolationIconProps) => {
  const config = violationConfig[type];
  const Icon = config.icon;
  
  return (
    <Icon 
      size={size} 
      className={cn(config.color[severity], className)} 
    />
  );
};

export default ViolationIcon;
