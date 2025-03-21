
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ViolationIcon from './ViolationIcon';
import { Filter, ShieldAlert, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProctoringFiltersProps {
  onFiltersChange: (filters: ViolationFilters) => void;
  className?: string;
}

export interface ViolationFilters {
  window: {
    above1min: boolean;
    upTo1min: boolean;
    upTo10sec: boolean;
  };
  image: {
    above5: boolean;
    between3and5: boolean;
    between0and2: boolean;
  };
  device: {
    headphones: boolean;
    cellphone: boolean;
  };
  time: {
    early: boolean;
    late: boolean;
  };
  severity: {
    high: boolean;
    medium: boolean;
    low: boolean;
    none: boolean;
  };
}

const defaultFilters: ViolationFilters = {
  window: {
    above1min: false,
    upTo1min: false,
    upTo10sec: false,
  },
  image: {
    above5: false,
    between3and5: false,
    between0and2: false,
  },
  device: {
    headphones: false,
    cellphone: false,
  },
  time: {
    early: false,
    late: false,
  },
  severity: {
    high: false,
    medium: false,
    low: false,
    none: false,
  },
};

export const ProctoringFilters = ({ onFiltersChange, className }: ProctoringFiltersProps) => {
  const [filters, setFilters] = useState<ViolationFilters>(defaultFilters);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleFilterChange = (
    category: keyof ViolationFilters,
    key: string,
    checked: boolean
  ) => {
    const newFilters = {
      ...filters,
      [category]: {
        ...filters[category as keyof ViolationFilters],
        [key]: checked,
      },
    };
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, category) => {
      return count + Object.values(category).filter(Boolean).length;
    }, 0);
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 h-10 px-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            <ShieldAlert size={16} />
            <span>Proctoring Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 bg-imocha-orange text-white">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          align="start" 
          className="w-[620px] p-0 bg-white rounded-lg shadow-elevation border animate-scale-in overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-imocha-darkGray" />
              <h3 className="font-medium text-sm">Proctoring Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <Button 
                  variant="ghost" 
                  onClick={clearFilters} 
                  className="h-8 px-2 text-xs text-imocha-darkGray hover:text-imocha-orange"
                >
                  Clear all filters
                </Button>
              )}
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setIsOpen(false)} 
                className="h-8 w-8 rounded-full"
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="violations" className="w-full">
            <TabsList className="grid grid-cols-2 p-1 mx-4 mt-3 mb-2 bg-muted rounded-md">
              <TabsTrigger value="violations" className="text-xs">By Violation Type</TabsTrigger>
              <TabsTrigger value="severity" className="text-xs">By Severity Level</TabsTrigger>
            </TabsList>
            
            <TabsContent value="violations" className="p-0">
              <div className="grid grid-cols-2 gap-4 p-4">
                <div className="space-y-4">
                  {/* Window Violations */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ViolationIcon type="window" />
                      <h4 className="text-sm font-medium">Window Violations</h4>
                    </div>
                    <div className="space-y-2 pl-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="window-above-1min"
                          checked={filters.window.above1min}
                          onCheckedChange={(checked) => 
                            handleFilterChange('window', 'above1min', checked === true)
                          }
                        />
                        <label 
                          htmlFor="window-above-1min" 
                          className="text-sm font-normal cursor-pointer"
                        >
                          Above 1 minute
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="window-up-to-1min"
                          checked={filters.window.upTo1min}
                          onCheckedChange={(checked) => 
                            handleFilterChange('window', 'upTo1min', checked === true)
                          }
                        />
                        <label 
                          htmlFor="window-up-to-1min" 
                          className="text-sm font-normal cursor-pointer"
                        >
                          Up to 1 minute
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="window-up-to-10sec"
                          checked={filters.window.upTo10sec}
                          onCheckedChange={(checked) => 
                            handleFilterChange('window', 'upTo10sec', checked === true)
                          }
                        />
                        <label 
                          htmlFor="window-up-to-10sec" 
                          className="text-sm font-normal cursor-pointer"
                        >
                          Up to 10 seconds
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Image Violations */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ViolationIcon type="image" />
                      <h4 className="text-sm font-medium">Image Violations</h4>
                    </div>
                    <div className="space-y-2 pl-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="image-above-5"
                          checked={filters.image.above5}
                          onCheckedChange={(checked) => 
                            handleFilterChange('image', 'above5', checked === true)
                          }
                        />
                        <label 
                          htmlFor="image-above-5" 
                          className="text-sm font-normal cursor-pointer"
                        >
                          5+ consecutive
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="image-3-to-5"
                          checked={filters.image.between3and5}
                          onCheckedChange={(checked) => 
                            handleFilterChange('image', 'between3and5', checked === true)
                          }
                        />
                        <label 
                          htmlFor="image-3-to-5" 
                          className="text-sm font-normal cursor-pointer"
                        >
                          3 to 5 consecutive
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="image-0-to-2"
                          checked={filters.image.between0and2}
                          onCheckedChange={(checked) => 
                            handleFilterChange('image', 'between0and2', checked === true)
                          }
                        />
                        <label 
                          htmlFor="image-0-to-2" 
                          className="text-sm font-normal cursor-pointer"
                        >
                          0 to 2 consecutive
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Device Detection */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ViolationIcon type="cellphone" />
                      <h4 className="text-sm font-medium">Device Detection</h4>
                    </div>
                    <div className="space-y-2 pl-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="device-headphones"
                          checked={filters.device.headphones}
                          onCheckedChange={(checked) => 
                            handleFilterChange('device', 'headphones', checked === true)
                          }
                        />
                        <label 
                          htmlFor="device-headphones" 
                          className="text-sm font-normal cursor-pointer"
                        >
                          Headphones detected
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="device-cellphone"
                          checked={filters.device.cellphone}
                          onCheckedChange={(checked) => 
                            handleFilterChange('device', 'cellphone', checked === true)
                          }
                        />
                        <label 
                          htmlFor="device-cellphone" 
                          className="text-sm font-normal cursor-pointer"
                        >
                          Cellphone detected
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Completion Time */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ViolationIcon type="time" />
                      <h4 className="text-sm font-medium">Completion Time</h4>
                    </div>
                    <div className="space-y-2 pl-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="time-early"
                          checked={filters.time.early}
                          onCheckedChange={(checked) => 
                            handleFilterChange('time', 'early', checked === true)
                          }
                        />
                        <label 
                          htmlFor="time-early" 
                          className="text-sm font-normal cursor-pointer"
                        >
                          Early finishers
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="time-late"
                          checked={filters.time.late}
                          onCheckedChange={(checked) => 
                            handleFilterChange('time', 'late', checked === true)
                          }
                        />
                        <label 
                          htmlFor="time-late" 
                          className="text-sm font-normal cursor-pointer"
                        >
                          Late finishers
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="severity" className="p-0">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Violation Severity</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="severity-high"
                        checked={filters.severity.high}
                        onCheckedChange={(checked) => 
                          handleFilterChange('severity', 'high', checked === true)
                        }
                      />
                      <label 
                        htmlFor="severity-high" 
                        className="text-sm font-normal cursor-pointer flex items-center gap-2"
                      >
                        <div className="w-3 h-3 rounded-full bg-severity-high"></div>
                        High severity
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="severity-medium"
                        checked={filters.severity.medium}
                        onCheckedChange={(checked) => 
                          handleFilterChange('severity', 'medium', checked === true)
                        }
                      />
                      <label 
                        htmlFor="severity-medium" 
                        className="text-sm font-normal cursor-pointer flex items-center gap-2"
                      >
                        <div className="w-3 h-3 rounded-full bg-severity-medium"></div>
                        Medium severity
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="severity-low"
                        checked={filters.severity.low}
                        onCheckedChange={(checked) => 
                          handleFilterChange('severity', 'low', checked === true)
                        }
                      />
                      <label 
                        htmlFor="severity-low" 
                        className="text-sm font-normal cursor-pointer flex items-center gap-2"
                      >
                        <div className="w-3 h-3 rounded-full bg-severity-low"></div>
                        Low severity
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="severity-none"
                        checked={filters.severity.none}
                        onCheckedChange={(checked) => 
                          handleFilterChange('severity', 'none', checked === true)
                        }
                      />
                      <label 
                        htmlFor="severity-none" 
                        className="text-sm font-normal cursor-pointer flex items-center gap-2"
                      >
                        <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                        No violations
                      </label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="px-2 py-3 bg-muted/50 rounded-lg">
                  <h5 className="text-xs font-medium mb-2 text-muted-foreground">About Severity Levels</h5>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-severity-high"></div>
                      <span>High: Major violations that likely affected test integrity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-severity-medium"></div>
                      <span>Medium: Suspicious activity that may have affected results</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-severity-low"></div>
                      <span>Low: Minor violations with minimal impact on test integrity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProctoringFilters;
