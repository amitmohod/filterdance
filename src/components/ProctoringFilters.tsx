
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ViolationIcon from './ViolationIcon';
import { Filter, ShieldAlert, X, Search, Bookmark, Clock, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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

// Quick filter presets
const quickFilterPresets = [
  {
    id: 'high-risk',
    name: 'High-Risk Candidates',
    filters: {
      window: { above1min: true, upTo1min: false, upTo10sec: false },
      image: { above5: true, between3and5: false, between0and2: false },
      device: { headphones: false, cellphone: true },
      time: { early: true, late: false },
      severity: { high: true, medium: false, low: false, none: false },
    }
  },
  {
    id: 'suspicious-objects',
    name: 'Suspicious Object Usage',
    filters: {
      window: { above1min: false, upTo1min: false, upTo10sec: false },
      image: { above5: false, between3and5: false, between0and2: false },
      device: { headphones: true, cellphone: true },
      time: { early: false, late: false },
      severity: { high: false, medium: false, low: false, none: false },
    }
  },
  {
    id: 'medium-severity',
    name: 'Medium Severity Issues',
    filters: {
      window: { above1min: false, upTo1min: true, upTo10sec: false },
      image: { above5: false, between3and5: true, between0and2: false },
      device: { headphones: true, cellphone: false },
      time: { early: false, late: false },
      severity: { high: false, medium: true, low: false, none: false },
    }
  }
];

export const ProctoringFilters = ({ onFiltersChange, className }: ProctoringFiltersProps) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<ViolationFilters>(defaultFilters);
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'categories' | 'presets' | 'search'>('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedPresets, setSavedPresets] = useState<{id: string, name: string, filters: ViolationFilters}[]>([]);
  const [presetName, setPresetName] = useState('');
  
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

  const applyQuickFilter = (preset: typeof quickFilterPresets[0]) => {
    setFilters(preset.filters);
    onFiltersChange(preset.filters);
    
    toast({
      title: "Quick Filter Applied",
      description: `Applied "${preset.name}" filter preset`,
    });
  };

  const saveCurrentPreset = () => {
    if (!presetName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your preset",
        variant: "destructive",
      });
      return;
    }
    
    const newPreset = {
      id: `custom-${Date.now()}`,
      name: presetName,
      filters: {...filters}
    };
    
    setSavedPresets([...savedPresets, newPreset]);
    setPresetName('');
    
    toast({
      title: "Preset Saved",
      description: `Filter preset "${presetName}" has been saved`,
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, category) => {
      return count + Object.values(category).filter(Boolean).length;
    }, 0);
  };

  const activeFilterCount = getActiveFilterCount();

  // Get all active filter names for display
  const getActiveFilterNames = () => {
    const activeFilters: string[] = [];
    
    if (filters.window.above1min) activeFilters.push("Window: Above 1 min");
    if (filters.window.upTo1min) activeFilters.push("Window: Up to 1 min");
    if (filters.window.upTo10sec) activeFilters.push("Window: Up to 10 sec");
    
    if (filters.image.above5) activeFilters.push("Image: 5+ consecutive");
    if (filters.image.between3and5) activeFilters.push("Image: 3-5 consecutive");
    if (filters.image.between0and2) activeFilters.push("Image: 0-2 consecutive");
    
    if (filters.device.headphones) activeFilters.push("Headphones detected");
    if (filters.device.cellphone) activeFilters.push("Cellphone detected");
    
    if (filters.time.early) activeFilters.push("Early finisher");
    if (filters.time.late) activeFilters.push("Late finisher");
    
    if (filters.severity.high) activeFilters.push("High severity");
    if (filters.severity.medium) activeFilters.push("Medium severity");
    if (filters.severity.low) activeFilters.push("Low severity");
    if (filters.severity.none) activeFilters.push("No violations");
    
    return activeFilters;
  };

  // Filter options based on search term
  const getFilteredOptions = () => {
    const searchLower = searchTerm.toLowerCase();
    const options: {category: string, section: keyof ViolationFilters, key: string, label: string}[] = [
      // Window violations
      {category: "Candidate Behavior", section: "window", key: "above1min", label: "Window violation: Above 1 minute"},
      {category: "Candidate Behavior", section: "window", key: "upTo1min", label: "Window violation: Up to 1 minute"},
      {category: "Candidate Behavior", section: "window", key: "upTo10sec", label: "Window violation: Up to 10 seconds"},
      
      // Image violations
      {category: "Candidate Behavior", section: "image", key: "above5", label: "Image: 5+ consecutive violations"},
      {category: "Candidate Behavior", section: "image", key: "between3and5", label: "Image: 3 to 5 consecutive violations"},
      {category: "Candidate Behavior", section: "image", key: "between0and2", label: "Image: 0 to 2 consecutive violations"},
      
      // Device detection
      {category: "Prohibited Objects", section: "device", key: "headphones", label: "Headphones detected"},
      {category: "Prohibited Objects", section: "device", key: "cellphone", label: "Cellphone detected"},
      
      // Time flags
      {category: "Candidate Behavior", section: "time", key: "early", label: "Early finisher"},
      {category: "Candidate Behavior", section: "time", key: "late", label: "Late finisher"},
      
      // Severity
      {category: "Test Integrity", section: "severity", key: "high", label: "High severity violations"},
      {category: "Test Integrity", section: "severity", key: "medium", label: "Medium severity violations"},
      {category: "Test Integrity", section: "severity", key: "low", label: "Low severity violations"},
      {category: "Test Integrity", section: "severity", key: "none", label: "No violations"},
    ];
    
    if (!searchTerm) return options;
    
    return options.filter(option => 
      option.label.toLowerCase().includes(searchLower) || 
      option.category.toLowerCase().includes(searchLower)
    );
  };

  // Remove a specific filter
  const removeFilter = (section: keyof ViolationFilters, key: string) => {
    const newFilters = {
      ...filters,
      [section]: {
        ...filters[section],
        [key]: false,
      },
    };
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

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
                  Reset filters
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
          
          {/* Active Filters Bar */}
          {activeFilterCount > 0 && (
            <div className="px-4 py-2 bg-muted/30 border-b">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Filter size={12} />
                <span>Active Filters:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getActiveFilterNames().map((filter, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="pl-2 pr-1 py-0.5 bg-white border flex items-center gap-1 text-xs"
                  >
                    {filter}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full p-0 hover:bg-muted"
                      onClick={() => {
                        // Extract section and key from filter name
                        const parts = filter.split(':');
                        let section: keyof ViolationFilters;
                        let key: string;
                        
                        if (filter.includes("Window")) {
                          section = "window";
                          key = filter.includes("Above 1 min") ? "above1min" : 
                               filter.includes("Up to 1 min") ? "upTo1min" : "upTo10sec";
                        } else if (filter.includes("Image")) {
                          section = "image";
                          key = filter.includes("5+") ? "above5" : 
                               filter.includes("3-5") ? "between3and5" : "between0and2";
                        } else if (filter.includes("Headphones")) {
                          section = "device";
                          key = "headphones";
                        } else if (filter.includes("Cellphone")) {
                          section = "device";
                          key = "cellphone";
                        } else if (filter.includes("Early")) {
                          section = "time";
                          key = "early";
                        } else if (filter.includes("Late")) {
                          section = "time";
                          key = "late";
                        } else if (filter.includes("High")) {
                          section = "severity";
                          key = "high";
                        } else if (filter.includes("Medium")) {
                          section = "severity";
                          key = "medium";
                        } else if (filter.includes("Low")) {
                          section = "severity";
                          key = "low";
                        } else {
                          section = "severity";
                          key = "none";
                        }
                        
                        removeFilter(section, key);
                      }}
                    >
                      <X size={10} />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Filter Navigation */}
          <div className="px-4 pt-3 mb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex bg-muted/50 p-1 rounded-md">
                <Button 
                  variant={activeView === 'categories' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('categories')}
                  className="text-xs h-8"
                >
                  By Categories
                </Button>
                <Button 
                  variant={activeView === 'presets' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('presets')}
                  className="text-xs h-8"
                >
                  Quick Filters
                </Button>
                <Button 
                  variant={activeView === 'search' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('search')}
                  className="text-xs h-8"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
          
          {/* Categories View */}
          {activeView === 'categories' && (
            <div className="p-4">
              <Tabs defaultValue="candidate" className="w-full">
                <TabsList className="grid grid-cols-3 p-1 mb-3 bg-muted rounded-md">
                  <TabsTrigger value="candidate" className="text-xs">Candidate Behavior</TabsTrigger>
                  <TabsTrigger value="objects" className="text-xs">Prohibited Objects</TabsTrigger>
                  <TabsTrigger value="integrity" className="text-xs">Test Integrity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="candidate" className="space-y-4">
                  {/* Window Violations */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ViolationIcon type="window" />
                        <h4 className="text-sm font-medium">Window Violations</h4>
                      </div>
                      <Switch 
                        checked={filters.window.above1min || filters.window.upTo1min || filters.window.upTo10sec}
                        onCheckedChange={(checked) => {
                          const newFilters = {
                            ...filters,
                            window: {
                              above1min: checked,
                              upTo1min: checked,
                              upTo10sec: checked
                            }
                          };
                          setFilters(newFilters);
                          onFiltersChange(newFilters);
                        }}
                      />
                    </div>
                    
                    {(filters.window.above1min || filters.window.upTo1min || filters.window.upTo10sec) && (
                      <div className="pl-6 space-y-2 pt-1">
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
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Image Violations */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ViolationIcon type="image" />
                        <h4 className="text-sm font-medium">Image Violations</h4>
                      </div>
                      <Switch 
                        checked={filters.image.above5 || filters.image.between3and5 || filters.image.between0and2}
                        onCheckedChange={(checked) => {
                          const newFilters = {
                            ...filters,
                            image: {
                              above5: checked,
                              between3and5: checked,
                              between0and2: checked
                            }
                          };
                          setFilters(newFilters);
                          onFiltersChange(newFilters);
                        }}
                      />
                    </div>
                    
                    {(filters.image.above5 || filters.image.between3and5 || filters.image.between0and2) && (
                      <div className="pl-6 space-y-2 pt-1">
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
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Completion Time */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ViolationIcon type="time" />
                        <h4 className="text-sm font-medium">Completion Time</h4>
                      </div>
                      <Switch 
                        checked={filters.time.early || filters.time.late}
                        onCheckedChange={(checked) => {
                          const newFilters = {
                            ...filters,
                            time: {
                              early: checked,
                              late: checked
                            }
                          };
                          setFilters(newFilters);
                          onFiltersChange(newFilters);
                        }}
                      />
                    </div>
                    
                    {(filters.time.early || filters.time.late) && (
                      <div className="pl-6 space-y-2 pt-1">
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
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="objects" className="space-y-4">
                  {/* Device Detection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ViolationIcon type="cellphone" />
                        <h4 className="text-sm font-medium">Device Detection</h4>
                      </div>
                      <Switch 
                        checked={filters.device.headphones || filters.device.cellphone}
                        onCheckedChange={(checked) => {
                          const newFilters = {
                            ...filters,
                            device: {
                              headphones: checked,
                              cellphone: checked
                            }
                          };
                          setFilters(newFilters);
                          onFiltersChange(newFilters);
                        }}
                      />
                    </div>
                    
                    {(filters.device.headphones || filters.device.cellphone) && (
                      <div className="pl-6 space-y-2 pt-1">
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
                    )}
                  </div>
                  
                  <div className="pt-4 px-4 pb-3 bg-muted/30 rounded-lg mt-4">
                    <p className="text-xs text-muted-foreground">
                      Prohibited objects are detected using AI-powered image analysis. These detections help identify candidates using unauthorized assistance during the assessment.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="integrity" className="space-y-4">
                  {/* Severity levels */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Violation Severity</h4>
                      <Switch 
                        checked={filters.severity.high || filters.severity.medium || filters.severity.low || filters.severity.none}
                        onCheckedChange={(checked) => {
                          const newFilters = {
                            ...filters,
                            severity: {
                              high: checked,
                              medium: checked,
                              low: checked,
                              none: checked
                            }
                          };
                          setFilters(newFilters);
                          onFiltersChange(newFilters);
                        }}
                      />
                    </div>
                    
                    {(filters.severity.high || filters.severity.medium || filters.severity.low || filters.severity.none) && (
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
                    )}
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
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {/* Quick Filters / Presets View */}
          {activeView === 'presets' && (
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Quick Filters</h4>
                <p className="text-xs text-muted-foreground">
                  Apply predefined filter combinations to quickly find candidates matching specific criteria.
                </p>
                
                <div className="space-y-2 mt-2">
                  {quickFilterPresets.map((preset) => (
                    <div 
                      key={preset.id}
                      className="border rounded-md p-3 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => applyQuickFilter(preset)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bookmark size={16} className="text-imocha-orange" />
                          <h5 className="font-medium text-sm">{preset.name}</h5>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7">
                          Apply
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 pl-6">
                        {preset.id === 'high-risk' && 'Candidates with serious violations that may compromise test integrity'}
                        {preset.id === 'suspicious-objects' && 'Candidates detected using prohibited devices during the assessment'}
                        {preset.id === 'medium-severity' && 'Candidates with moderate violations that need review'}
                      </p>
                    </div>
                  ))}
                  
                  {savedPresets.map((preset) => (
                    <div 
                      key={preset.id}
                      className="border rounded-md p-3 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => applyQuickFilter(preset)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bookmark size={16} className="text-imocha-blue" />
                          <h5 className="font-medium text-sm">{preset.name}</h5>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7">
                          Apply
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 pl-6">
                        Custom filter preset
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Save Current Filters</h4>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter preset name"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    className="h-9"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveCurrentPreset}
                    className="whitespace-nowrap"
                    disabled={!presetName.trim() || activeFilterCount === 0}
                  >
                    <Save size={14} className="mr-1" />
                    Save Preset
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Search View */}
          {activeView === 'search' && (
            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search for filters by name or category..." 
                  className="pl-9 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
                {getFilteredOptions().length > 0 ? (
                  getFilteredOptions().map((option, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`search-${option.section}-${option.key}`}
                          checked={filters[option.section][option.key as keyof typeof filters[typeof option.section]]}
                          onCheckedChange={(checked) => 
                            handleFilterChange(option.section, option.key, checked === true)
                          }
                        />
                        <div>
                          <label 
                            htmlFor={`search-${option.section}-${option.key}`} 
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option.label}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Category: {option.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground text-sm mb-2">No filters found matching "{searchTerm}"</p>
                    <p className="text-xs text-muted-foreground">Try a different search term or browse by categories</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProctoringFilters;
