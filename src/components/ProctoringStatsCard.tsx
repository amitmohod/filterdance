
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Camera, Headphones, MonitorOff, Smartphone, Clock } from 'lucide-react';

interface ViolationStats {
  type: string;
  count: number;
  percentage: number;
  severity: 'low' | 'medium' | 'high';
}

interface ProctoringStatsCardProps {
  stats: {
    window: ViolationStats[];
    image: ViolationStats[];
    device: ViolationStats[];
    time: ViolationStats[];
  };
  className?: string;
}

const iconMap = {
  window: MonitorOff,
  image: Camera,
  headphones: Headphones,
  cellphone: Smartphone,
  time: Clock,
};

const severityColorMap = {
  low: 'text-severity-low',
  medium: 'text-severity-medium',
  high: 'text-severity-high',
};

const progressColorMap = {
  low: 'bg-severity-low',
  medium: 'bg-severity-medium',
  high: 'bg-severity-high',
};

export const ProctoringStatsCard = ({ stats, className }: ProctoringStatsCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-muted/50 pb-3">
        <CardTitle className="text-base">Violation Statistics</CardTitle>
        <CardDescription>Summary of proctoring violations</CardDescription>
      </CardHeader>
      <Tabs defaultValue="window" className="w-full">
        <TabsList className="flex px-4 pt-3 pb-0 justify-start w-full bg-white border-b space-x-2">
          <TabsTrigger value="window" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary">
            Window
          </TabsTrigger>
          <TabsTrigger value="image" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary">
            Image
          </TabsTrigger>
          <TabsTrigger value="device" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary">
            Device
          </TabsTrigger>
          <TabsTrigger value="time" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary">
            Time
          </TabsTrigger>
        </TabsList>
        
        <CardContent className="p-4">
          <TabsContent value="window" className="mt-0 space-y-4">
            {stats.window.map((item, index) => {
              const Icon = iconMap.window;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Icon className={cn("mr-2 h-4 w-4", severityColorMap[item.severity])} />
                      <span className="text-sm">{item.type}</span>
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={item.percentage} 
                      className="h-2 w-full bg-muted/50" 
                    />
                    <div 
                      className={cn("absolute top-0 left-0 h-2 rounded-full", progressColorMap[item.severity])}
                      style={{width: `${item.percentage}%`}}
                    />
                  </div>
                </div>
              );
            })}
          </TabsContent>
          
          <TabsContent value="image" className="mt-0 space-y-4">
            {stats.image.map((item, index) => {
              const Icon = iconMap.image;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Icon className={cn("mr-2 h-4 w-4", severityColorMap[item.severity])} />
                      <span className="text-sm">{item.type}</span>
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={item.percentage} 
                      className="h-2 w-full bg-muted/50" 
                    />
                    <div 
                      className={cn("absolute top-0 left-0 h-2 rounded-full", progressColorMap[item.severity])}
                      style={{width: `${item.percentage}%`}}
                    />
                  </div>
                </div>
              );
            })}
          </TabsContent>
          
          <TabsContent value="device" className="mt-0 space-y-4">
            {stats.device.map((item, index) => {
              const Icon = iconMap[item.type === 'Headphones Detected' ? 'headphones' : 'cellphone'];
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Icon className={cn("mr-2 h-4 w-4", severityColorMap[item.severity])} />
                      <span className="text-sm">{item.type}</span>
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={item.percentage} 
                      className="h-2 w-full bg-muted/50" 
                    />
                    <div 
                      className={cn("absolute top-0 left-0 h-2 rounded-full", progressColorMap[item.severity])}
                      style={{width: `${item.percentage}%`}}
                    />
                  </div>
                </div>
              );
            })}
          </TabsContent>
          
          <TabsContent value="time" className="mt-0 space-y-4">
            {stats.time.map((item, index) => {
              const Icon = iconMap.time;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Icon className={cn("mr-2 h-4 w-4", severityColorMap[item.severity])} />
                      <span className="text-sm">{item.type}</span>
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={item.percentage} 
                      className="h-2 w-full bg-muted/50" 
                    />
                    <div 
                      className={cn("absolute top-0 left-0 h-2 rounded-full", progressColorMap[item.severity])}
                      style={{width: `${item.percentage}%`}}
                    />
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default ProctoringStatsCard;
