import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, Building, Briefcase, TrendingUp, Shield, Smartphone, Bot, Heart, Clock } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import type { Job, Company } from "@shared/schema";

export default function Landing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const { data: jobs = [] } = useQuery({
    queryKey: ["/api/jobs"],
  }) as { data: (Job & { company: Company })[] };

  const { data: templates = [] } = useQuery({
    queryKey: ["/api/cv-templates"],
  }) as { data: any[] };

  const featuredJobs = jobs.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#00B14F] to-[#1E7E34] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              CVBuilder Pro - Tạo CV, Tìm việc làm, Tuyển dụng hiệu quả
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Nền tảng tuyển dụng thông minh với AI, tối ưu hóa trải nghiệm tuyển dụng
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-4 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Vị trí tuyển dụng, tên công ty"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="h-12">
                      <MapPin className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Địa điểm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hanoi">Hà Nội</SelectItem>
                      <SelectItem value="hochiminh">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="danang">Đà Nẵng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-[#00B14F] hover:bg-[#1E7E34] h-12 px-8">
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </Button>
              </div>
            </Card>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">9.5M+</div>
              <div className="text-green-100">Ứng viên</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">200K+</div>
              <div className="text-green-100">Nhà tuyển dụng</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">60K+</div>
              <div className="text-green-100">Việc làm mới/ngày</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">#1</div>
              <div className="text-green-100">Nền tảng tuyển dụng VN</div>
            </div>
          </div>
        </div>
      </section>

      {/* CV Builder Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#343A40] mb-4">Tạo CV chuyên nghiệp trong 5 phút</h2>
            <p className="text-xl text-[#6C757D]">Chọn mẫu CV phù hợp với ngành nghề và tạo CV ấn tượng</p>
          </div>

          {/* CV Templates Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {templates.slice(0, 6).map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-[#00B14F] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-lg font-semibold">{template.name}</div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-[#343A40] mb-2">{template.name}</h3>
                  <p className="text-sm text-[#6C757D]">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild className="bg-[#00B14F] hover:bg-[#1E7E34]">
              <Link href="/api/login">
                Tạo CV miễn phí
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Job Search Interface */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#343A40] mb-4">Việc làm tốt nhất</h2>
            <p className="text-xl text-[#6C757D]">Tìm kiếm công việc phù hợp với kỹ năng và kinh nghiệm của bạn</p>
          </div>

          {/* Job Listings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00B14F] to-[#1E7E34] rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#343A40]">{job.title}</h3>
                      <p className="text-[#6C757D] text-sm">{job.company?.name}</p>
                    </div>
                  </div>
                  <Heart className="h-5 w-5 text-gray-300 hover:text-red-500 cursor-pointer" />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.salaryMin && job.salaryMax && (
                    <Badge variant="secondary" className="bg-[#00B14F]/10 text-[#00B14F]">
                      {job.salaryMin}-{job.salaryMax} triệu
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                    {job.location}
                  </Badge>
                  {job.experienceLevel && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-600">
                      {job.experienceLevel}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-[#6C757D] mb-4 line-clamp-2">
                  {job.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-[#6C757D]">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <Button size="sm" className="bg-[#00B14F] hover:bg-[#1E7E34]">
                    Ứng tuyển
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" asChild className="border-[#00B14F] text-[#00B14F] hover:bg-[#00B14F] hover:text-white">
              <Link href="/jobs">
                Xem thêm việc làm
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#343A40] mb-4">Tính năng nổi bật</h2>
            <p className="text-xl text-[#6C757D]">Trải nghiệm tuyển dụng được tối ưu hóa bởi AI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-[#00B14F]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-[#00B14F]" />
              </div>
              <h3 className="font-semibold text-[#343A40] mb-3">AI Matching</h3>
              <p className="text-[#6C757D]">Thuật toán AI phân tích hồ sơ và gợi ý công việc phù hợp nhất</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-[#343A40] mb-3">Mobile App</h3>
              <p className="text-[#6C757D]">Ứng dụng di động với đầy đủ tính năng cho iOS và Android</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-[#343A40] mb-3">Bảo mật</h3>
              <p className="text-[#6C757D]">Thông tin cá nhân được bảo vệ với tiêu chuẩn bảo mật cao nhất</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
