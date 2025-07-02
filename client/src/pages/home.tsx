import { useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Briefcase, TrendingUp, Settings, Plus, Eye, Clock } from "lucide-react";
import Header from "@/components/header";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: cvs = [], isLoading: cvsLoading } = useQuery({
    queryKey: ["/api/cvs"],
    enabled: isAuthenticated,
  });

  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/applications"],
    enabled: isAuthenticated,
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["/api/jobs"],
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00B14F]"></div>
      </div>
    );
  }

  const recentJobs = jobs.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#343A40] mb-2">
            Chào mừng trở lại, {user?.firstName || user?.email}!
          </h1>
          <p className="text-[#6C757D]">Quản lý CV và theo dõi ứng tuyển của bạn</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CV của tôi</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cvs.length}</div>
              <p className="text-xs text-muted-foreground">
                CV đã tạo
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đơn ứng tuyển</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">
                Đã ứng tuyển
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lượt xem hồ sơ</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                Trong tuần này
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My CVs Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>CV của tôi</CardTitle>
                <Button asChild size="sm" className="bg-[#00B14F] hover:bg-[#1E7E34]">
                  <Link href="/cv-builder">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo CV mới
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {cvsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : cvs.length === 0 ? (
                <div className="text-center py-8 text-[#6C757D]">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Chưa có CV nào. Tạo CV đầu tiên của bạn!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cvs.slice(0, 3).map((cv) => (
                    <div key={cv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-[#00B14F]" />
                        <div>
                          <h4 className="font-medium text-[#343A40]">{cv.title}</h4>
                          <p className="text-sm text-[#6C757D]">
                            Cập nhật {new Date(cv.updatedAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/cv-builder/${cv.id}`}>
                          Chỉnh sửa
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Đơn ứng tuyển gần đây</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/applications">
                    Xem tất cả
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {applicationsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8 text-[#6C757D]">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Chưa có đơn ứng tuyển nào.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 3).map((application) => (
                    <div key={application.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-[#343A40]">{application.job.title}</h4>
                        <Badge 
                          variant={
                            application.status === 'accepted' ? 'default' :
                            application.status === 'rejected' ? 'destructive' :
                            application.status === 'interview' ? 'secondary' :
                            'outline'
                          }
                        >
                          {application.status === 'pending' ? 'Đang xét duyệt' :
                           application.status === 'reviewing' ? 'Đang xem xét' :
                           application.status === 'interview' ? 'Phỏng vấn' :
                           application.status === 'accepted' ? 'Chấp nhận' :
                           'Từ chối'}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#6C757D]">{application.job.company.name}</p>
                      <div className="flex items-center text-xs text-[#6C757D] mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        Ứng tuyển {new Date(application.appliedAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommended Jobs */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Việc làm phù hợp</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/jobs">
                  Xem tất cả
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00B14F] to-[#1E7E34] rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#343A40]">{job.title}</h4>
                      <p className="text-sm text-[#6C757D]">{job.company?.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {job.location}
                    </Badge>
                    {job.salaryMin && job.salaryMax && (
                      <Badge variant="secondary" className="text-xs">
                        {job.salaryMin}-{job.salaryMax}M
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" className="w-full bg-[#00B14F] hover:bg-[#1E7E34]">
                    Ứng tuyển
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
