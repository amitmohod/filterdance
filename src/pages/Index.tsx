
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import ProctoringSeverityBadge from '@/components/ProctoringSeverityBadge';
import ProctoringFilters, { ViolationFilters } from '@/components/ProctoringFilters';
import ProctoringViolations from '@/components/ProctoringViolations';
import ProctoringStatsCard from '@/components/ProctoringStatsCard';
import { ViolationType } from '@/components/ViolationIcon';
import { 
  ChevronLeft, 
  Filter, 
  Search, 
  User, 
  Clock, 
  ClipboardCheck, 
  ChevronUp, 
  ChevronDown,
  FileText, 
  Settings, 
  ExternalLink
} from 'lucide-react';

// Sample data for demonstration
const candidatesData = [
  {
    id: 1,
    name: 'Jansy Alexander',
    email: 'stamilvelue@guidehouse.com',
    score: '218.54/400',
    percentage: 52,
    proficiency: 'Proficient',
    status: 'Completed',
    completedDate: '17-Feb-2025, 05:17 PM',
    appearedDate: '17-Feb-2025, 04:50 PM',
    violations: [
      { type: 'window' as ViolationType, count: 1, severity: 'medium' as const, details: '2 minutes' },
      { type: 'image' as ViolationType, count: 1, severity: 'medium' as const, details: '4 violations' },
      { type: 'headphones' as ViolationType, count: 1, severity: 'medium' as const },
    ],
    candidateStatus: 'Not Assigned',
  },
  {
    id: 2,
    name: 'Sairam Tamilvelu',
    email: 'stamilvelue@guidehouse.com',
    score: '207.48/400',
    percentage: 52,
    proficiency: 'Proficient',
    status: 'Completed',
    completedDate: '13-Feb-2025, 03:56 PM',
    appearedDate: '13-Feb-2025, 03:19 PM',
    violations: [
      { type: 'window' as ViolationType, count: 1, severity: 'low' as const, details: '5 seconds' },
      { type: 'image' as ViolationType, count: 1, severity: 'medium' as const, details: '3 violations' },
      { type: 'time' as ViolationType, count: 1, severity: 'low' as const, details: 'Early finisher' },
    ],
    candidateStatus: 'Not Assigned',
  },
  {
    id: 3,
    name: 'Eby M Mathai',
    email: 'emathai@guidehouse.com',
    score: '10/400',
    percentage: 2.5,
    proficiency: 'Beginner',
    status: 'Completed',
    completedDate: '13-Feb-2025, 03:56 PM',
    appearedDate: '13-Feb-2025, 03:19 PM',
    violations: [
      { type: 'window' as ViolationType, count: 1, severity: 'high' as const, details: '5 minutes' },
      { type: 'image' as ViolationType, count: 1, severity: 'medium' as const, details: '3 violations' },
      { type: 'time' as ViolationType, count: 1, severity: 'high' as const, details: 'Very early' },
      { type: 'headphones' as ViolationType, count: 1, severity: 'medium' as const },
      { type: 'cellphone' as ViolationType, count: 1, severity: 'high' as const },
    ],
    candidateStatus: 'Not Assigned',
  },
  {
    id: 4,
    name: 'Malavika B',
    email: 'karatmalavika@gmail.com',
    score: '40/400',
    percentage: 52,
    proficiency: 'Intermediate',
    status: 'Completed',
    completedDate: '13-Feb-2025, 03:56 PM',
    appearedDate: '13-Feb-2025, 03:19 PM',
    violations: [
      { type: 'cellphone' as ViolationType, count: 1, severity: 'high' as const },
      { type: 'headphones' as ViolationType, count: 1, severity: 'medium' as const },
    ],
    candidateStatus: 'Not Assigned',
  },
  {
    id: 5,
    name: 'Akanksha Shah',
    email: 'akanksha@guidehouse.com',
    score: '207.48/400',
    percentage: 52,
    proficiency: 'Proficient',
    status: 'Completed',
    completedDate: '13-Feb-2025, 03:56 PM',
    appearedDate: '13-Feb-2025, 03:19 PM',
    violations: [
      { type: 'window' as ViolationType, count: 1, severity: 'low' as const, details: '8 seconds' },
      { type: 'image' as ViolationType, count: 1, severity: 'low' as const, details: '1 violation' },
    ],
    candidateStatus: 'Not Assigned',
  },
];

// Sample stats data
const proctoringStats = {
  window: [
    { type: 'Above 1 min', count: 2, percentage: 40, severity: 'high' as const },
    { type: 'Up to 1 min', count: 1, percentage: 20, severity: 'medium' as const },
    { type: 'Up to 10 sec', count: 2, percentage: 40, severity: 'low' as const },
  ],
  image: [
    { type: '5+ Consecutive', count: 1, percentage: 20, severity: 'high' as const },
    { type: '3 to 5 Consecutive', count: 3, percentage: 60, severity: 'medium' as const },
    { type: '0 to 2 Consecutive', count: 1, percentage: 20, severity: 'low' as const },
  ],
  device: [
    { type: 'Headphones Detected', count: 3, percentage: 60, severity: 'medium' as const },
    { type: 'Cellphone Detected', count: 2, percentage: 40, severity: 'high' as const },
  ],
  time: [
    { type: 'Early Finishers', count: 2, percentage: 40, severity: 'medium' as const },
    { type: 'Late Finishers', count: 0, percentage: 0, severity: 'low' as const },
  ],
};

const Index = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeFilters, setActiveFilters] = useState<ViolationFilters>({
    window: { above1min: false, upTo1min: false, upTo10sec: false },
    image: { above5: false, between3and5: false, between0and2: false },
    device: { headphones: false, cellphone: false },
    time: { early: false, late: false },
    severity: { high: false, medium: false, low: false, none: false },
  });

  const handleFiltersChange = (filters: ViolationFilters) => {
    setActiveFilters(filters);
    
    // Count active filters
    const activeCount = Object.values(filters).reduce((count, category) => {
      return count + Object.values(category).filter(Boolean).length;
    }, 0);
    
    if (activeCount > 0) {
      toast({
        title: "Filters Applied",
        description: `${activeCount} filter${activeCount > 1 ? 's' : ''} applied to the candidate list`,
      });
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Determine violation severity for each candidate
  const candidatesWithSeverity = candidatesData.map(candidate => {
    const maxSeverity = candidate.violations.reduce((max, violation) => {
      const severityRank = { low: 1, medium: 2, high: 3 };
      return severityRank[violation.severity] > severityRank[max] ? violation.severity : max;
    }, 'low' as 'low' | 'medium' | 'high');
    
    return {
      ...candidate,
      severityLevel: maxSeverity,
      violationCount: candidate.violations.length
    };
  });

  // Apply search filter
  const filteredCandidates = candidatesWithSeverity.filter(candidate => {
    const searchMatch = search.trim() === '' || 
      candidate.name.toLowerCase().includes(search.toLowerCase()) || 
      candidate.email.toLowerCase().includes(search.toLowerCase());
    
    return searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-imocha-orange rounded-md flex items-center justify-center text-white font-bold text-xl mr-2">
                i
              </div>
              <span className="text-xl font-medium">iMocha</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-500 hover:text-imocha-orange transition-colors">Dashboard</a>
              <a href="#" className="text-gray-500 hover:text-imocha-orange transition-colors font-medium">
                Candidates 
                <ChevronDown className="h-4 w-4 inline ml-1" />
              </a>
              <a href="#" className="text-gray-500 hover:text-imocha-orange transition-colors font-medium">
                My Tests
                <ChevronDown className="h-4 w-4 inline ml-1" />
              </a>
              <a href="#" className="text-gray-500 hover:text-imocha-orange transition-colors">
                AI-Skills Match
                <Badge className="ml-1 bg-red-100 text-red-500 font-normal text-[10px]">BETA</Badge>
              </a>
              <a href="#" className="text-gray-500 hover:text-imocha-orange transition-colors">TalentFlow</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Clock className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sub Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              
              <div className="ml-4">
                <Badge className="bg-green-100 text-green-600 rounded-sm px-2 py-0.5 text-xs font-medium mb-1">PUBLISHED</Badge>
                <h1 className="text-xl font-semibold">Front-end Web Developer</h1>
              </div>
            </div>
            
            <Button className="bg-imocha-blue hover:bg-imocha-blue/90 text-white">
              Proceed to Invite
            </Button>
          </div>
          
          <Tabs defaultValue="reports" className="mt-6">
            <TabsList className="bg-transparent border-b w-full justify-start space-x-6 h-auto p-0">
              <TabsTrigger 
                value="questions" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary"
              >
                Questions
              </TabsTrigger>
              <TabsTrigger 
                value="invite" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary"
              >
                Invite
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary"
              >
                Reports
              </TabsTrigger>
              <TabsTrigger 
                value="share" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary"
              >
                Share Test
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary"
              >
                Settings
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary"
              >
                Test Analytics
                <Badge className="ml-1 bg-yellow-100 text-yellow-600 font-normal text-[10px]">NEW</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Table */}
          <div className="col-span-12 lg:col-span-8">
            <Card className="shadow-sm">
              <CardContent className="p-0">
                {/* Table Controls */}
                <div className="flex flex-wrap items-center justify-between p-3 border-b gap-3">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Candidate name or email id" 
                      className="pl-9 h-10 w-full md:w-80"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">
                      1-10 of 10
                    </div>
                    
                    <div className="flex items-center">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-md rounded-r-none">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-none rounded-r-md">
                        <ChevronLeft className="h-4 w-4 rotate-180" />
                      </Button>
                    </div>
                    
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                          <div className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-imocha-orange mr-2" />
                            CANDIDATE NAME & EMAIL
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-1 cursor-pointer" onClick={toggleSortDirection}>
                            SCORE
                            {sortDirection === 'asc' ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                          TEST STATUS
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                          <div className="flex items-center gap-1">
                            APPEARED ON
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </th>
                        <th className="py-3 px-4 text-center text-sm font-medium text-muted-foreground bg-imocha-orange/5 border-x border-imocha-orange/10">
                          PROCTORING
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                          CANDIDATE STATUS
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.map((candidate) => (
                        <tr key={candidate.id} className="border-b hover:bg-muted/10 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <input type="checkbox" className="rounded border-gray-300 text-imocha-orange mr-2" />
                              <div>
                                <div className="font-medium text-blue-600">{candidate.name}</div>
                                <div className="text-sm text-gray-500">{candidate.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium">{candidate.score}</div>
                            <div className="text-sm">({candidate.percentage}%)</div>
                            <div className="text-xs text-imocha-orange">{candidate.proficiency}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div>{candidate.status}</div>
                            <div className="text-xs text-gray-500">on {candidate.completedDate}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div>{candidate.appearedDate.split(',')[0]}</div>
                            <div className="text-xs text-gray-500">{candidate.appearedDate.split(',')[1]}</div>
                          </td>
                          <td className="py-4 px-4 text-center bg-imocha-orange/5 border-x border-imocha-orange/10">
                            {candidate.violations.length > 0 ? (
                              <ProctoringViolations violations={candidate.violations} />
                            ) : (
                              <div className="text-sm text-gray-500">No violations</div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div>{candidate.candidateStatus}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ClipboardCheck className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar Filters */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="font-medium mb-3">REPORT INSIGHTS</h2>
              
              <div className="space-y-3">
                <div className="relative">
                  <select className="w-full p-2.5 border rounded-md appearance-none pr-8">
                    <option>All Reports</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                </div>
                
                <div className="relative">
                  <select className="w-full p-2.5 border rounded-md appearance-none pr-8">
                    <option>Status (All)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                </div>
                
                <div className="relative">
                  <select className="w-full p-2.5 border rounded-md appearance-none pr-8">
                    <option>Candidate Status (All)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                </div>
                
                <div className="relative">
                  <select className="w-full p-2.5 border rounded-md appearance-none pr-8">
                    <option>All Test Links</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                </div>
                
                <div className="relative">
                  <select className="w-full p-2.5 border rounded-md appearance-none pr-8">
                    <option>Performance Categories</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                </div>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h2 className="font-medium mb-3 text-imocha-orange">TEST VIOLATIONS</h2>
                
                <div className="space-y-3">
                  <ProctoringFilters onFiltersChange={handleFiltersChange} />
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium mb-3">Test Score</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <input type="radio" id="percentage" name="score-type" className="mr-2" checked />
                      <label htmlFor="percentage" className="text-sm">Percentage</label>
                    </div>
                  </div>
                  
                  <div className="relative pt-6">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="0"
                      step="1"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button className="flex-1 bg-imocha-orange hover:bg-imocha-orange/90">Apply</Button>
                    <Button variant="outline" className="flex-1">Clear</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <ProctoringStatsCard stats={proctoringStats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
