import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  RefreshCw,
  FileText,
} from "lucide-react";
import { PageBreadcrumb } from "./PageBreadcrumb";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Badge {
  id: number;
  code: string;
  name: string;
  validFrom: Date;
  validTo: Date;
  academicStatus: string;
  scope: string;
  analysisType: string;
  criteriaValue: string;
  category: string;
  description: string;
  imageFile: string;
  isActive: boolean;
}

interface BadgeManagementProps {
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
}

export function BadgeManagement({ badges, setBadges }: BadgeManagementProps) {

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBadge, setEditingBadge] =
    useState<Badge | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    validFrom: new Date(),
    validTo: new Date(),
    academicStatus: "",
    scope: "",
    analysisType: "",
    criteriaValue: "",
    category: "",
    description: "",
    imageFile: "",
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      validFrom: new Date(),
      validTo: new Date(),
      academicStatus: "",
      scope: "",
      analysisType: "",
      criteriaValue: "",
      category: "",
      description: "",
      imageFile: "",
      isActive: true,
    });
    setEditingBadge(null);
  };

  const handleEdit = (badge: Badge) => {
    setEditingBadge(badge);
    setFormData({
      code: badge.code,
      name: badge.name,
      validFrom: badge.validFrom,
      validTo: badge.validTo,
      academicStatus: badge.academicStatus,
      scope: badge.scope,
      analysisType: badge.analysisType,
      criteriaValue: badge.criteriaValue,
      category: badge.category,
      description: badge.description,
      imageFile: badge.imageFile,
      isActive: badge.isActive,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setBadges(badges.filter((badge) => badge.id !== id));
  };

  const handleSubmit = () => {
    if (editingBadge) {
      setBadges(
        badges.map((badge) =>
          badge.id === editingBadge.id
            ? { ...editingBadge, ...formData }
            : badge,
        ),
      );
    } else {
      const newBadge: Badge = {
        id: badges.length + 1,
        ...formData,
      };
      setBadges([...badges, newBadge]);
    }
    setIsFormOpen(false);
    resetForm();
  };

  const filteredBadges = badges.filter(
    (badge) =>
      badge.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      badge.code
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-0">
      <PageBreadcrumb
        title="뱃지 기준 관리"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "학생성공", href: "#" },
          { label: "뱃지 관리", href: "#" },
          { label: "뱃지 기준 관리" },
        ]}
        pageCode="NONMAJOR_BDG0100"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Search className="mr-2 h-4 w-4" />
              조회
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} size="sm">
                <FileText className="mr-2 h-4 w-4" />
                신규
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBadge ? "뱃지 수정" : "뱃지 생성"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">뱃지코드</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value,
                      })
                    }
                    placeholder="뱃지코드를 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">뱃지명</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    placeholder="뱃지명을 입력하세요"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>유효기간 (시작)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        {format(
                          formData.validFrom,
                          "yyyy-MM-dd",
                          { locale: ko },
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.validFrom}
                        onSelect={(date) =>
                          date &&
                          setFormData({
                            ...formData,
                            validFrom: date,
                          })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>유효기간 (종료)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        {format(
                          formData.validTo,
                          "yyyy-MM-dd",
                          { locale: ko },
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.validTo}
                        onSelect={(date) =>
                          date &&
                          setFormData({
                            ...formData,
                            validTo: date,
                          })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academicStatus">
                    기준학적
                  </Label>
                  <Select
                    value={formData.academicStatus}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        academicStatus: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="재학생">
                        재학생
                      </SelectItem>
                      <SelectItem value="휴학생">
                        휴학생
                      </SelectItem>
                      <SelectItem value="졸업생">
                        졸업생
                      </SelectItem>
                      <SelectItem value="전체">전체</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scope">적용범위</Label>
                  <Select
                    value={formData.scope}
                    onValueChange={(value) =>
                      setFormData({ ...formData, scope: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="전체">전체</SelectItem>
                      <SelectItem value="단과대">
                        단과대
                      </SelectItem>
                      <SelectItem value="학과">학과</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="analysisType">기준분석</Label>
                  <Select
                    value={formData.analysisType}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        analysisType: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="봉사시간">
                        봉사시간
                      </SelectItem>
                      <SelectItem value="출석률">
                        출석률
                      </SelectItem>
                      <SelectItem value="평점">평점</SelectItem>
                      <SelectItem value="수상실적">
                        수상실적
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criteriaValue">기준값</Label>
                  <Input
                    id="criteriaValue"
                    value={formData.criteriaValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        criteriaValue: e.target.value,
                      })
                    }
                    placeholder="예: 30시간 이상"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                  placeholder="예: 봉사, 출결, 성적"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageFile">
                  뱃지 이미지 파일
                </Label>
                <Input
                  id="imageFile"
                  value={formData.imageFile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      imageFile: e.target.value,
                    })
                  }
                  placeholder="이미지 파일명"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="뱃지에 대한 설명을 입력하세요"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      isActive: checked,
                    })
                  }
                />
                <Label htmlFor="isActive">사용여부</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                <X className="mr-2 h-4 w-4" />
                취소
              </Button>
              <Button onClick={handleSubmit}>
                <Save className="mr-2 h-4 w-4" />
                저장
              </Button>
            </div>
          </DialogContent>
        </Dialog>
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              저장
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        <Card>
        <CardHeader>
          <CardTitle>뱃지 검색</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="뱃지코드/명"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              조회
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>뱃지 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead className="w-12">삭제</TableHead>
                  <TableHead className="w-12">편집</TableHead>
                  <TableHead>뱃지코드</TableHead>
                  <TableHead>뱃지명</TableHead>
                  <TableHead>유효기간</TableHead>
                  <TableHead>기준학적</TableHead>
                  <TableHead>기준분석</TableHead>
                  <TableHead>기준값</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>뱃지 이미지 파일</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>사용여부</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBadges.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={13}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-12 w-12 text-muted-foreground/50" />
                        <p>데이터가 없습니다.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBadges.map((badge, index) => (
                    <TableRow key={badge.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(badge.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(badge)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>{badge.code}</TableCell>
                      <TableCell>{badge.name}</TableCell>
                      <TableCell>
                        {format(badge.validFrom, "yyyy-MM-dd")}{" "}
                        ~ {format(badge.validTo, "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell>
                        {badge.academicStatus}
                      </TableCell>
                      <TableCell>
                        {badge.analysisType}
                      </TableCell>
                      <TableCell>
                        {badge.criteriaValue}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{badge.category}</Badge>
                      </TableCell>
                      <TableCell>{badge.imageFile}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {badge.description}
                      </TableCell>
                      <TableCell>
                        {badge.isActive ? "사용" : "미사용"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}