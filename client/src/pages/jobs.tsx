import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Filter, Clock, Heart, Building } from "lucide-react";
import Header from "@/components/header";
import JobCard from "@/components/job-card";
import { useQuery } from "@tanstack/react-query";

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["/api/jobs", { search: searchTerm, location, industry, salaryMin, experienceLevel }],
  });

  const handleSearch = () => {
    // Trigger search with current filters
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#343A40] mb-2">Tìm việc làm</h1>
          <p className="text-[#6C757D] mb-6">Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu</p>
          
          {/* Search Bar */}
          <Card className="p-4 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm vị trí, công ty..."
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
                    <SelectValue placeholder="Tất cả địa điểm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả địa điểm</SelectItem>
                    <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                    <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
                    <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                    <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                    <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} className="bg-[#00B14F] hover:bg-[#1E7E34] h-12 px-8">
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </Card>

          {/* Filters */}
          <Card className="p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Bộ lọc nâng cao</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả ngành nghề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả ngành nghề</SelectItem>
                  <SelectItem value="Công nghệ thông tin">Công nghệ thông tin</SelectItem>
                  <SelectItem value="Kế toán - Kiểm toán">Kế toán - Kiểm toán</SelectItem>
                  <SelectItem value="Kinh doanh - Bán hàng">Kinh doanh - Bán hàng</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Nhân sự">Nhân sự</SelectItem>
                  <SelectItem value="Tài chính - Ngân hàng">Tài chính - Ngân hàng</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={salaryMin} onValueChange={setSalaryMin}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả mức lương" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả mức lương</SelectItem>
                  <SelectItem value="5">Dưới 5 triệu</SelectItem>
                  <SelectItem value="10">5-10 triệu</SelectItem>
                  <SelectItem value="15">10-15 triệu</SelectItem>
                  <SelectItem value="20">15-20 triệu</SelectItem>
                  <SelectItem value="30">20-30 triệu</SelectItem>
                  <SelectItem value="50">Trên 30 triệu</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả kinh nghiệm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả kinh nghiệm</SelectItem>
                  <SelectItem value="entry">Không yêu cầu</SelectItem>
                  <SelectItem value="junior">1-2 năm</SelectItem>
                  <SelectItem value="mid">3-5 năm</SelectItem>
                  <SelectItem value="senior">5+ năm</SelectItem>
                  <SelectItem value="executive">Cấp cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#343A40]">
              {isLoading ? "Đang tải..." : `${jobs.length} việc làm phù hợp`}
            </h2>
          </div>
          <Select defaultValue="newest">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="salary-high">Lương cao nhất</SelectItem>
              <SelectItem value="salary-low">Lương thấp nhất</SelectItem>
              <SelectItem value="deadline">Sắp hết hạn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Listings */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <Card className="p-12 text-center">
            <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-[#343A40] mb-2">Không tìm thấy việc làm phù hợp</h3>
            <p className="text-[#6C757D] mb-4">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setLocation("");
              setIndustry("");
              setSalaryMin("");
              setExperienceLevel("");
            }}>
              Xóa bộ lọc
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* Load More */}
        {jobs.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Tải thêm việc làm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
