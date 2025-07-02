import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Building, MapPin, Clock, DollarSign, Users, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  salaryMin?: string;
  salaryMax?: string;
  location: string;
  jobType?: string;
  experienceLevel?: string;
  industry?: string;
  isActive: boolean;
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
  company: {
    id: number;
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    industry?: string;
    size?: string;
    location?: string;
  };
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/applications", {
        jobId: job.id,
        coverLetter: "", // Could be expanded to include cover letter
      });
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã ứng tuyển thành công!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Cần đăng nhập",
          description: "Vui lòng đăng nhập để ứng tuyển.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Lỗi",
        description: "Không thể ứng tuyển. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  const handleApply = () => {
    if (!isAuthenticated) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để ứng tuyển.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
    applyMutation.mutate();
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để lưu việc làm.",
        variant: "destructive",
      });
      return;
    }
    setIsFavorited(!isFavorited);
  };

  const formatSalary = (min?: string, max?: string) => {
    if (!min && !max) return null;
    if (min && max) return `${min}-${max} triệu`;
    if (min) return `Từ ${min} triệu`;
    if (max) return `Đến ${max} triệu`;
  };

  const getExperienceLevelText = (level?: string) => {
    switch (level) {
      case 'entry': return 'Không yêu cầu KN';
      case 'junior': return '1-2 năm KN';
      case 'mid': return '3-5 năm KN';
      case 'senior': return '5+ năm KN';
      case 'executive': return 'Cấp cao';
      default: return level;
    }
  };

  const getJobTypeText = (type?: string) => {
    switch (type) {
      case 'full-time': return 'Toàn thời gian';
      case 'part-time': return 'Bán thời gian';
      case 'contract': return 'Hợp đồng';
      case 'internship': return 'Thực tập';
      default: return type;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00B14F] to-[#1E7E34] rounded-lg flex items-center justify-center flex-shrink-0">
              {job.company.logo ? (
                <img 
                  src={job.company.logo} 
                  alt={job.company.name}
                  className="w-8 h-8 rounded object-cover"
                />
              ) : (
                <Building className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#343A40] group-hover:text-[#00B14F] transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-[#6C757D] text-sm truncate">{job.company.name}</p>
              <div className="flex items-center text-xs text-[#6C757D] mt-1">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavorite}
            className="flex-shrink-0"
          >
            <Heart 
              className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-500'}`} 
            />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {formatSalary(job.salaryMin, job.salaryMax) && (
            <Badge variant="secondary" className="bg-[#00B14F]/10 text-[#00B14F] text-xs">
              <DollarSign className="h-3 w-3 mr-1" />
              {formatSalary(job.salaryMin, job.salaryMax)}
            </Badge>
          )}
          
          {job.experienceLevel && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-600 text-xs">
              <Users className="h-3 w-3 mr-1" />
              {getExperienceLevelText(job.experienceLevel)}
            </Badge>
          )}
          
          {job.jobType && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-600 text-xs">
              <Briefcase className="h-3 w-3 mr-1" />
              {getJobTypeText(job.jobType)}
            </Badge>
          )}
          
          {job.industry && (
            <Badge variant="outline" className="text-xs">
              {job.industry}
            </Badge>
          )}
        </div>

        <p className="text-sm text-[#6C757D] mb-4 line-clamp-2">
          {job.description}
        </p>

        {job.requirements && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-[#343A40] mb-1">Yêu cầu:</h4>
            <p className="text-xs text-[#6C757D] line-clamp-2">{job.requirements}</p>
          </div>
        )}

        {job.benefits && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-[#343A40] mb-1">Quyền lợi:</h4>
            <p className="text-xs text-[#6C757D] line-clamp-2">{job.benefits}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center text-xs text-[#6C757D]">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              {new Date(job.createdAt).toLocaleDateString('vi-VN')}
            </span>
            {job.applicationDeadline && (
              <>
                <span className="mx-2">•</span>
                <span>
                  Hết hạn: {new Date(job.applicationDeadline).toLocaleDateString('vi-VN')}
                </span>
              </>
            )}
          </div>
          <Button 
            size="sm" 
            className="bg-[#00B14F] hover:bg-[#1E7E34]"
            onClick={handleApply}
            disabled={applyMutation.isPending}
          >
            {applyMutation.isPending ? "Đang ứng tuyển..." : "Ứng tuyển"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
