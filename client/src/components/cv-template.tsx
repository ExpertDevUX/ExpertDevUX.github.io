import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, Star } from "lucide-react";

interface CvTemplate {
  id: number;
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

interface CvTemplateProps {
  template: CvTemplate;
  onSelect?: (template: CvTemplate) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

export default function CvTemplate({ 
  template, 
  onSelect, 
  isSelected = false, 
  showActions = true 
}: CvTemplateProps) {
  
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'professional': return 'bg-blue-100 text-blue-600';
      case 'creative': return 'bg-purple-100 text-purple-600';
      case 'simple': return 'bg-gray-100 text-gray-600';
      case 'technical': return 'bg-green-100 text-green-600';
      case 'executive': return 'bg-red-100 text-red-600';
      case 'student': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getCategoryText = (category?: string) => {
    switch (category) {
      case 'professional': return 'Chuyên nghiệp';
      case 'creative': return 'Sáng tạo';
      case 'simple': return 'Đơn giản';
      case 'technical': return 'Kỹ thuật';
      case 'executive': return 'Giám đốc';
      case 'student': return 'Sinh viên';
      default: return category;
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-xl transition-all cursor-pointer group ${
      isSelected ? 'ring-2 ring-[#00B14F] shadow-lg' : ''
    }`}>
      <div 
        className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden"
        onClick={() => onSelect?.(template)}
      >
        {template.imageUrl ? (
          <img 
            src={template.imageUrl} 
            alt={template.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-[#00B14F] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div className="text-lg font-semibold text-[#343A40] group-hover:text-[#00B14F] transition-colors">
              {template.name}
            </div>
          </div>
        )}
        
        {/* Overlay for actions */}
        {showActions && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Category Badge */}
        {template.category && (
          <div className="absolute top-3 left-3">
            <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
              {getCategoryText(template.category)}
            </Badge>
          </div>
        )}

        {/* Popular Badge */}
        {template.category === 'professional' && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-[#00B14F] text-white text-xs">
              <Star className="h-3 w-3 mr-1" />
              Phổ biến
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-[#343A40] mb-2 group-hover:text-[#00B14F] transition-colors">
          {template.name}
        </h3>
        
        {template.description && (
          <p className="text-sm text-[#6C757D] mb-3 line-clamp-2">
            {template.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-[#6C757D]">
            <FileText className="h-3 w-3 mr-1" />
            <span>Mẫu CV</span>
          </div>
          
          {showActions && (
            <Button 
              size="sm" 
              className="bg-[#00B14F] hover:bg-[#1E7E34]"
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(template);
              }}
            >
              {isSelected ? 'Đã chọn' : 'Chọn mẫu'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
