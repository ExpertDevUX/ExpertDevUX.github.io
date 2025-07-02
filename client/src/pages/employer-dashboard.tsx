import { useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Briefcase, Users, Eye, Plus, Edit, MapPin, Calendar, Clock } from "lucide-react";
import Header from "@/components/header";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function EmployerDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated or not employer/admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== 'employer' && user?.role !== 'admin'))) {
      toast({
        title: "Unauthorized",
        description: "You need employer access to view this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs"],
    enabled: isAuthenticated && (user?.role === 'employer' || user?.role === 'admin'),
  });

  const { data: companies = [], isLoading: companiesLoading } = useQuery({
    queryKey: ["/api/companies"],
    enabled: isAuthenticated && (user?.role === 'employer' || user?.role === 'admin'),
  });

  // Filter jobs posted by current user (if not admin)
  const myJobs = user?.role === 'admin' ? jobs : jobs.filter((job: any) => job.postedById === user?.id);
  const activeJobs = myJobs.filter((job: any) => job.isActive);
  const totalApplications = 0; // This would come from aggregated data

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00B14F]"></div>
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== 'employer' && user?.role !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#343A40] mb-2">
            Dashboard Nhà tuyển dụng
          </h1>
          <p className="text-[#6C757D]">Quản lý tin tuyển dụng và ứng viên của bạn</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tin tuyển dụng</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00B14F]">{myJobs.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeJobs.length} đang hoạt động
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ứng viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#007BFF]">{totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                Tổng số ứng tuyển
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lượt xem</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#FFC107]">2,456</div>
              <p className="text-xs text-muted-foreground">
                Lượt xem trong tháng
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs">Tin tuyển dụng</TabsTrigger>
            <TabsTrigger value="applications">Ứng viên</TabsTrigger>
            <TabsTrigger value="companies">Công ty</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quản lý tin tuyển dụng</CardTitle>
                  <Button className="bg-[#00B14F] hover:bg-[#1E7E34]">
                    <Plus className="h-4 w-4 mr-2" />
                    Đăng tin mới
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : myJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-[#343A40] mb-2">Chưa có tin tuyển dụng</h3>
                    <p className="text-[#6C757D] mb-4">Bắt đầu tuyển dụng bằng cách đăng tin tuyển dụng đầu tiên</p>
                    <Button className="bg-[#00B14F] hover:bg-[#1E7E34]">
                      <Plus className="h-4 w-4 mr-2" />
                      Đăng tin tuyển dụng
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myJobs.map((job: any) => (
                      <div key={job.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg text-[#343A40]">{job.title}</h3>
                              <Badge variant={job.isActive ? 'default' : 'secondary'}>
                                {job.isActive ? 'Hoạt động' : 'Tạm dừng'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[#6C757D] mb-3">
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {job.company?.name}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                            <p className="text-sm text-[#6C757D] line-clamp-2">{job.description}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-[#6C757D]" />
                              <span>0 ứng tuyển</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4 text-[#6C757D]" />
                              <span>245 lượt xem</span>
                            </div>
                            {job.applicationDeadline && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-[#6C757D]" />
                                <span>Hết hạn {new Date(job.applicationDeadline).toLocaleDateString('vi-VN')}</span>
                              </div>
                            )}
                          </div>
                          <Button size="sm" className="bg-[#00B14F] hover:bg-[#1E7E34]">
                            Xem ứng viên
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ứng viên gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-[#343A40] mb-2">Chưa có ứng viên</h3>
                  <p className="text-[#6C757D]">Ứng viên sẽ xuất hiện ở đây khi họ ứng tuyển vào các vị trí của bạn</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Thông tin công ty</CardTitle>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm công ty
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {companiesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : companies.length === 0 ? (
                  <div className="text-center py-12">
                    <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-[#343A40] mb-2">Chưa có thông tin công ty</h3>
                    <p className="text-[#6C757D] mb-4">Thêm thông tin công ty để thu hút ứng viên tốt hơn</p>
                    <Button className="bg-[#00B14F] hover:bg-[#1E7E34]">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm công ty
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {companies.slice(0, 5).map((company: any) => (
                      <div key={company.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#00B14F] to-[#1E7E34] rounded-lg flex items-center justify-center">
                              <Building className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-[#343A40]">{company.name}</h3>
                              <p className="text-[#6C757D] text-sm">{company.industry}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-[#6C757D]">
                                <span>{company.size}</span>
                                <span>{company.location}</span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </Button>
                        </div>
                        {company.description && (
                          <p className="mt-4 text-sm text-[#6C757D] line-clamp-2">{company.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
