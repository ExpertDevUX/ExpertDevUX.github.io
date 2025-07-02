import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { User, Settings, LogOut, PlusCircle, Briefcase, Users, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-[#00B14F] cursor-pointer">CVBuilder Pro</h1>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/jobs" className="text-[#343A40] hover:text-[#00B14F] px-3 py-2 text-sm font-medium transition-colors">
                  Việc làm
                </Link>
                {isAuthenticated && (
                  <Link href="/cv-builder" className="text-[#343A40] hover:text-[#00B14F] px-3 py-2 text-sm font-medium transition-colors">
                    Tạo CV
                  </Link>
                )}
                <a href="#" className="text-[#343A40] hover:text-[#00B14F] px-3 py-2 text-sm font-medium transition-colors">
                  Công cụ
                </a>
                <a href="#" className="text-[#343A40] hover:text-[#00B14F] px-3 py-2 text-sm font-medium transition-colors">
                  Cẩm nang nghề nghiệp
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
            ) : !isAuthenticated ? (
              <>
                <Button 
                  className="bg-[#00B14F] text-white hover:bg-[#1E7E34]"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Đăng ký
                </Button>
                <Button 
                  variant="outline" 
                  className="border-[#00B14F] text-[#00B14F] hover:bg-[#00B14F] hover:text-white"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Đăng nhập
                </Button>
                <Button 
                  className="bg-[#007BFF] text-white hover:bg-blue-600"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Đăng tuyển & tìm hồ sơ
                </Button>
              </>
            ) : (
              <>
                {/* Quick Actions for Authenticated Users */}
                {user?.role === 'job_seeker' && (
                  <Button asChild size="sm" className="bg-[#00B14F] hover:bg-[#1E7E34]">
                    <Link href="/cv-builder">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Tạo CV
                    </Link>
                  </Button>
                )}
                
                {(user?.role === 'employer' || user?.role === 'admin') && (
                  <Button asChild size="sm" className="bg-[#007BFF] hover:bg-blue-600">
                    <Link href="/employer">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Đăng tuyển
                    </Link>
                  </Button>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.email} />
                        <AvatarFallback className="bg-[#00B14F] text-white">
                          {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user?.firstName && user?.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user?.email}
                        </p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={
                            user?.role === 'admin' ? 'default' :
                            user?.role === 'employer' ? 'secondary' :
                            'outline'
                          } className="text-xs">
                            {user?.role === 'admin' ? 'Quản trị viên' :
                             user?.role === 'employer' ? 'Nhà tuyển dụng' :
                             'Ứng viên'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link href="/">
                        <User className="mr-2 h-4 w-4" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    {user?.role === 'employer' && (
                      <DropdownMenuItem asChild>
                        <Link href="/employer">
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>Dashboard Nhà tuyển dụng</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Quản trị hệ thống</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => window.location.href = "/api/logout"}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
