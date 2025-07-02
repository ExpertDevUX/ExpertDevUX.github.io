import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { FileText, Save, Download, Eye, Plus, Trash2, ArrowLeft } from "lucide-react";
import Header from "@/components/header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import CvTemplate from "@/components/cv-template";
import type { CvTemplate as CvTemplateType } from "@shared/schema";

interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    objective: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
}

const defaultCVData: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    objective: ''
  },
  experience: [],
  education: [],
  skills: [],
  certifications: []
};

export default function CvBuilder() {
  const [match, params] = useRoute("/cv-builder/:id?");
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [cvTitle, setCvTitle] = useState("CV mới");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [currentStep, setCurrentStep] = useState<'template' | 'builder'>('template');

  const cvId = params?.id ? parseInt(params.id) : null;

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

  // Fetch CV data if editing
  const { data: cv, isLoading: cvLoading } = useQuery({
    queryKey: ["/api/cvs", cvId],
    enabled: !!cvId && isAuthenticated,
  });

  // Fetch CV templates
  const { data: templates = [] } = useQuery({
    queryKey: ["/api/cv-templates"],
  });

  // Load CV data when fetched
  useEffect(() => {
    if (cv && typeof cv === 'object') {
      const cvData = cv as any;
      setCvTitle(cvData.title || "CV mới");
      setSelectedTemplate(cvData.templateId || null);
      if (cvData.data) {
        setCvData(cvData.data as CVData);
      }
      // Skip template selection if editing existing CV
      if (cvData.templateId) {
        setCurrentStep('builder');
      }
    }
  }, [cv]);

  // Save CV mutation
  const saveCvMutation = useMutation({
    mutationFn: async (data: { title: string; templateId: number | null; data: CVData }) => {
      if (cvId) {
        return await apiRequest("PUT", `/api/cvs/${cvId}`, data);
      } else {
        return await apiRequest("POST", "/api/cvs", data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "CV đã được lưu thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cvs"] });
      if (!cvId) {
        // Redirect to home after creating new CV
        window.location.href = "/";
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Lỗi",
        description: "Không thể lưu CV. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!selectedTemplate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn mẫu CV",
        variant: "destructive",
      });
      return;
    }

    saveCvMutation.mutate({
      title: cvTitle,
      templateId: selectedTemplate,
      data: cvData,
    });
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        school: '',
        degree: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setCvData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    setCvData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        name: '',
        issuer: '',
        date: ''
      }]
    }));
  };

  const updateCertification = (index: number, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (index: number) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  if (isLoading || cvLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00B14F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[#343A40]">
                {currentStep === 'template' 
                  ? "Chọn mẫu CV" 
                  : (cvId ? "Chỉnh sửa CV" : "Tạo CV mới")
                }
              </h1>
              <p className="text-[#6C757D]">
                {currentStep === 'template' 
                  ? "Chọn mẫu CV phù hợp với ngành nghề của bạn" 
                  : "Tạo CV chuyên nghiệp trong vài phút"
                }
              </p>
            </div>
          </div>
          {currentStep === 'builder' && (
            <div className="flex items-center space-x-3">
              <Button variant="outline" disabled>
                <Eye className="h-4 w-4 mr-2" />
                Xem trước
              </Button>
              <Button variant="outline" disabled>
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saveCvMutation.isPending}
                className="bg-[#00B14F] hover:bg-[#1E7E34]"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveCvMutation.isPending ? "Đang lưu..." : "Lưu CV"}
              </Button>
            </div>
          )}
        </div>

        {/* Template Selection Step */}
        {currentStep === 'template' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#343A40] mb-4">
                Chọn mẫu CV phù hợp
              </h2>
              <p className="text-[#6C757D] max-w-2xl mx-auto">
                Chúng tôi có 12 mẫu CV chuyên nghiệp được thiết kế cho từng ngành nghề và cấp độ kinh nghiệm khác nhau.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(templates as CvTemplateType[]).map((template) => (
                <CvTemplate
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onSelect={(template) => {
                    setSelectedTemplate(template.id);
                    setCurrentStep('builder');
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* CV Builder Form */}
        {currentStep === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
              <CardHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cvTitle">Tên CV</Label>
                    <Input
                      id="cvTitle"
                      value={cvTitle}
                      onChange={(e) => setCvTitle(e.target.value)}
                      placeholder="Nhập tên CV"
                    />
                  </div>
                  <div>
                    <Label htmlFor="template">Chọn mẫu CV</Label>
                    <Select value={selectedTemplate?.toString()} onValueChange={(value) => setSelectedTemplate(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mẫu CV" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="personal">Thông tin</TabsTrigger>
                    <TabsTrigger value="experience">Kinh nghiệm</TabsTrigger>
                    <TabsTrigger value="education">Học vấn</TabsTrigger>
                    <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
                    <TabsTrigger value="certifications">Chứng chỉ</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Input
                          id="fullName"
                          value={cvData.personalInfo.fullName}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                          }))}
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={cvData.personalInfo.email}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, email: e.target.value }
                          }))}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          value={cvData.personalInfo.phone}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, phone: e.target.value }
                          }))}
                          placeholder="0123456789"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                          id="address"
                          value={cvData.personalInfo.address}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, address: e.target.value }
                          }))}
                          placeholder="Hà Nội, Việt Nam"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="objective">Mục tiêu nghề nghiệp</Label>
                      <Textarea
                        id="objective"
                        value={cvData.personalInfo.objective}
                        onChange={(e) => setCvData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, objective: e.target.value }
                        }))}
                        placeholder="Mô tả mục tiêu nghề nghiệp của bạn..."
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Kinh nghiệm làm việc</h3>
                      <Button onClick={addExperience} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm kinh nghiệm
                      </Button>
                    </div>
                    {cvData.experience.map((exp, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Kinh nghiệm #{index + 1}</h4>
                            <Button 
                              onClick={() => removeExperience(index)}
                              size="sm" 
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Công ty</Label>
                              <Input
                                value={exp.company}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                placeholder="Tên công ty"
                              />
                            </div>
                            <div>
                              <Label>Vị trí</Label>
                              <Input
                                value={exp.position}
                                onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                placeholder="Vị trí công việc"
                              />
                            </div>
                            <div>
                              <Label>Ngày bắt đầu</Label>
                              <Input
                                type="date"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Ngày kết thúc</Label>
                              <Input
                                type="date"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label>Mô tả công việc</Label>
                            <Textarea
                              value={exp.description}
                              onChange={(e) => updateExperience(index, 'description', e.target.value)}
                              placeholder="Mô tả chi tiết công việc và thành tích..."
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {cvData.experience.length === 0 && (
                      <div className="text-center py-8 text-[#6C757D]">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Chưa có kinh nghiệm nào. Thêm kinh nghiệm đầu tiên!</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="education" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Học vấn</h3>
                      <Button onClick={addEducation} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm học vấn
                      </Button>
                    </div>
                    {cvData.education.map((edu, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Học vấn #{index + 1}</h4>
                            <Button 
                              onClick={() => removeEducation(index)}
                              size="sm" 
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Trường học</Label>
                              <Input
                                value={edu.school}
                                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                placeholder="Tên trường"
                              />
                            </div>
                            <div>
                              <Label>Bằng cấp</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                placeholder="Bằng cấp/Chuyên ngành"
                              />
                            </div>
                            <div>
                              <Label>Ngày bắt đầu</Label>
                              <Input
                                type="date"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Ngày kết thúc</Label>
                              <Input
                                type="date"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label>Mô tả</Label>
                            <Textarea
                              value={edu.description}
                              onChange={(e) => updateEducation(index, 'description', e.target.value)}
                              placeholder="Thành tích học tập, hoạt động..."
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {cvData.education.length === 0 && (
                      <div className="text-center py-8 text-[#6C757D]">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Chưa có thông tin học vấn. Thêm học vấn đầu tiên!</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Kỹ năng</h3>
                      <div className="flex gap-2 mb-4">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Nhập kỹ năng"
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <Button onClick={addSkill} variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cvData.skills.map((skill, index) => (
                          <div key={index} className="flex items-center bg-[#00B14F]/10 text-[#00B14F] px-3 py-1 rounded-full">
                            <span>{skill}</span>
                            <Button
                              onClick={() => removeSkill(index)}
                              size="sm"
                              variant="ghost"
                              className="ml-2 h-auto p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      {cvData.skills.length === 0 && (
                        <div className="text-center py-8 text-[#6C757D]">
                          <p>Chưa có kỹ năng nào. Thêm kỹ năng của bạn!</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="certifications" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Chứng chỉ</h3>
                      <Button onClick={addCertification} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm chứng chỉ
                      </Button>
                    </div>
                    {cvData.certifications.map((cert, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Chứng chỉ #{index + 1}</h4>
                            <Button 
                              onClick={() => removeCertification(index)}
                              size="sm" 
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Tên chứng chỉ</Label>
                              <Input
                                value={cert.name}
                                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                                placeholder="Tên chứng chỉ"
                              />
                            </div>
                            <div>
                              <Label>Tổ chức cấp</Label>
                              <Input
                                value={cert.issuer}
                                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                                placeholder="Tổ chức cấp chứng chỉ"
                              />
                            </div>
                            <div>
                              <Label>Ngày cấp</Label>
                              <Input
                                type="date"
                                value={cert.date}
                                onChange={(e) => updateCertification(index, 'date', e.target.value)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {cvData.certifications.length === 0 && (
                      <div className="text-center py-8 text-[#6C757D]">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Chưa có chứng chỉ nào. Thêm chứng chỉ của bạn!</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* CV Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Xem trước CV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-6 min-h-[600px] shadow-sm">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#343A40]">
                      {cvData.personalInfo.fullName || "Họ và tên"}
                    </h2>
                    <p className="text-[#6C757D]">{cvData.personalInfo.email}</p>
                    <p className="text-[#6C757D]">{cvData.personalInfo.phone}</p>
                    <p className="text-[#6C757D]">{cvData.personalInfo.address}</p>
                  </div>

                  {cvData.personalInfo.objective && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-semibold text-[#00B14F] mb-2">MỤC TIÊU NGHỀ NGHIỆP</h3>
                        <p className="text-sm text-[#6C757D]">{cvData.personalInfo.objective}</p>
                      </div>
                    </>
                  )}

                  {cvData.experience.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-semibold text-[#00B14F] mb-2">KINH NGHIỆM LÀM VIỆC</h3>
                        {cvData.experience.map((exp, index) => (
                          <div key={index} className="mb-3">
                            <h4 className="font-medium text-sm">{exp.position} - {exp.company}</h4>
                            <p className="text-xs text-[#6C757D]">{exp.startDate} - {exp.endDate}</p>
                            <p className="text-xs text-[#6C757D] mt-1">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {cvData.education.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-semibold text-[#00B14F] mb-2">HỌC VẤN</h3>
                        {cvData.education.map((edu, index) => (
                          <div key={index} className="mb-3">
                            <h4 className="font-medium text-sm">{edu.degree} - {edu.school}</h4>
                            <p className="text-xs text-[#6C757D]">{edu.startDate} - {edu.endDate}</p>
                            <p className="text-xs text-[#6C757D] mt-1">{edu.description}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {cvData.skills.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-semibold text-[#00B14F] mb-2">KỸ NĂNG</h3>
                        <div className="flex flex-wrap gap-1">
                          {cvData.skills.map((skill, index) => (
                            <span key={index} className="bg-[#00B14F]/10 text-[#00B14F] px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {cvData.certifications.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-semibold text-[#00B14F] mb-2">CHỨNG CHỈ</h3>
                        {cvData.certifications.map((cert, index) => (
                          <div key={index} className="mb-2">
                            <h4 className="font-medium text-sm">{cert.name}</h4>
                            <p className="text-xs text-[#6C757D]">{cert.issuer} - {cert.date}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
