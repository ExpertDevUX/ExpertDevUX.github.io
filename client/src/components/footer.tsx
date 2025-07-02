import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#00B14F] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">TP</span>
              </div>
              <span className="text-xl font-bold">ThongPham.Tech</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Nền tảng tạo CV và tìm việc làm hàng đầu Việt Nam. Kết nối ứng viên với nhà tuyển dụng một cách hiệu quả và chuyên nghiệp.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#00B14F] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00B14F] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00B14F] transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00B14F] transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-[#00B14F] transition-colors">
                  Tìm việc làm
                </Link>
              </li>
              <li>
                <Link href="/cv-builder" className="text-gray-300 hover:text-[#00B14F] transition-colors">
                  Tạo CV online
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00B14F] transition-colors">
                  Hướng dẫn viết CV
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00B14F] transition-colors">
                  Công cụ CV
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00B14F] transition-colors">
                  Mẫu CV đẹp
                </a>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dành cho nhà tuyển dụng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00B14F] transition-colors">
                  Đăng tin tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00B14F] transition-colors">
                  Tìm kiếm ứng viên
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00B14F] transition-colors">
                  Gói dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00B14F] transition-colors">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00B14F] transition-colors">
                  Thống kê hiệu quả
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <MapPin size={16} className="text-[#00B14F] flex-shrink-0" />
                <span className="text-gray-300">Tầng 15, Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-[#00B14F] flex-shrink-0" />
                <span className="text-gray-300">1900 9090 (Miễn phí)</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-[#00B14F] flex-shrink-0" />
                <span className="text-gray-300">contact@thongpham.tech</span>
              </li>
            </ul>
            <div className="pt-4">
              <p className="text-xs text-gray-400">
                Giấy phép hoạt động dịch vụ việc làm số: 18/SLĐTBXH-GP
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Ngày cấp: 15/05/2024
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 ThongPham.Tech. All rights reserved. | 
              <a href="#" className="hover:text-[#00B14F] ml-1">Điều khoản sử dụng</a> | 
              <a href="#" className="hover:text-[#00B14F] ml-1">Chính sách bảo mật</a>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Powered by</span>
              <span className="text-[#00B14F] font-semibold">ThongPham Technology</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}