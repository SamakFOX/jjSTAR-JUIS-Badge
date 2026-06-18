import { useState } from "react";
import { Plus, Search, RefreshCw, FileText, CheckCircle, XCircle } from "lucide-react";
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
  DialogFooter,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { format } from "date-fns";

interface BadgeRequest {
  id: number;
  name: string;
  expiryDays: string;
  academicStatus: string;
  scope: string;
  category: string;
  imageFile: string;
  description: string;
  status: "승인대기" | "승인" | "반려";
  rejectionReason?: string;
  requestDate: Date;
  department: string;
}

export function BadgeRegistration() {
  const [requests, setRequests] = useState<BadgeRequest[]>([
    {
      id: 1,
      name: "게임마스터",
      expiryDays: "무제한",
      academicStatus: "재학생",
      scope: "학과 전용",
      category: "학과",
      imageFile: "badge-dept-game.png",
      description: "게임학과 4학기 연속 등록",
      status: "승인대기",
      requestDate: new Date(2026, 4, 10),
      department: "게임학과",
    },
    {
      id: 2,
      name: "웹툰크리에이터",
      expiryDays: "무제한",
      academicStatus: "재학생",
      scope: "학과 전용",
      category: "학과",
      imageFile: "",
      description: "웹툰만화콘텐츠학과 전공 우수작 3회 이상",
      status: "반려",
      rejectionReason: "뱃지 이미지가 등록되지 않았습니다.",
      requestDate: new Date(2026, 4, 8),
      department: "웹툰만화콘텐츠학과",
    },
    {
      id: 3,
      name: "백의천사",
      expiryDays: "30일",
      academicStatus: "재학생",
      scope: "학과 전용",
      category: "학과",
      imageFile: "badge-dept-nursing.png",
      description: "간호학과 실습 평가 A+ 획득",
      status: "반려",
      rejectionReason: "획득 조건이 까다로운 뱃지에 유효기간 30일은 너무 짧습니다. 최소 90일 이상으로 설정해주세요.",
      requestDate: new Date(2026, 4, 5),
      department: "간호학과",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BadgeRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    expiryDays: "",
    academicStatus: "",
    scope: "",
    category: "",
    imageFile: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      expiryDays: "",
      academicStatus: "",
      scope: "",
      category: "",
      imageFile: "",
      description: "",
    });
  };

  const handleSubmit = () => {
    const newRequest: BadgeRequest = {
      id: requests.length + 1,
      ...formData,
      status: "승인대기",
      requestDate: new Date(),
      department: "기초교양대학", // 예시
    };
    setRequests([newRequest, ...requests]);
    setIsFormOpen(false);
    resetForm();
  };

  const handleApprove = (id: number) => {
    setRequests(
      requests.map((req) => (req.id === id ? { ...req, status: "승인" as const } : req))
    );
  };

  const handleReject = () => {
    if (selectedRequest) {
      setRequests(
        requests.map((req) =>
          req.id === selectedRequest.id
            ? { ...req, status: "반려" as const, rejectionReason }
            : req
        )
      );
      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
    }
  };

  const openRejectDialog = (request: BadgeRequest) => {
    setSelectedRequest(request);
    setRejectionReason(request.rejectionReason || "");
    setRejectDialogOpen(true);
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-0">
      <PageBreadcrumb
        title="뱃지 등록"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "학생성공", href: "#" },
          { label: "뱃지 관리", href: "#" },
          { label: "뱃지 등록" },
        ]}
        pageCode="NONMAJOR_BDG0103"
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
                  <DialogTitle>뱃지 등록 요청</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">뱃지명</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="뱃지명을 입력하세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryDays">발급일로부터 만료기간</Label>
                    <Input
                      id="expiryDays"
                      value={formData.expiryDays}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDays: e.target.value })
                      }
                      placeholder="예: 30일, 90일, 무제한"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="academicStatus">대상</Label>
                      <Select
                        value={formData.academicStatus}
                        onValueChange={(value) =>
                          setFormData({ ...formData, academicStatus: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="재학생">재학생</SelectItem>
                          <SelectItem value="휴학생">휴학생</SelectItem>
                          <SelectItem value="졸업생">졸업생</SelectItem>
                          <SelectItem value="전체">전체</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scope">범위</Label>
                      <Select
                        value={formData.scope}
                        onValueChange={(value) => setFormData({ ...formData, scope: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="전체">전체</SelectItem>
                          <SelectItem value="학과 전용">학과 전용</SelectItem>
                          <SelectItem value="단과대">단과대</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">카테고리</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="예: 학과, 봉사, 출결"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageFile">뱃지 이미지 파일</Label>
                    <Input
                      id="imageFile"
                      value={formData.imageFile}
                      onChange={(e) => setFormData({ ...formData, imageFile: e.target.value })}
                      placeholder="이미지 파일명"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">설명</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="뱃지 획득 조건을 입력하세요"
                      rows={4}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleSubmit}>등록</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>검색</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="뱃지명 또는 학과명"
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
            <CardTitle>뱃지 등록 요청 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>학과</TableHead>
                    <TableHead>뱃지명</TableHead>
                    <TableHead>만료기간</TableHead>
                    <TableHead>대상</TableHead>
                    <TableHead>범위</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>이미지</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>신청일</TableHead>
                    <TableHead>처리결과</TableHead>
                    <TableHead className="w-32">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={12}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-12 w-12 text-muted-foreground/50" />
                          <p>등록 요청이 없습니다.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request, index) => (
                      <TableRow key={request.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{request.department}</TableCell>
                        <TableCell>{request.name}</TableCell>
                        <TableCell>{request.expiryDays}</TableCell>
                        <TableCell>{request.academicStatus}</TableCell>
                        <TableCell>{request.scope}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{request.category}</Badge>
                        </TableCell>
                        <TableCell>
                          {request.imageFile ? (
                            <span className="text-xs text-muted-foreground">
                              {request.imageFile}
                            </span>
                          ) : (
                            <Badge variant="destructive">미등록</Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm">
                          {request.description}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(request.requestDate, "yyyy-MM-dd")}
                        </TableCell>
                        <TableCell>
                          {request.status === "승인대기" && (
                            <Badge variant="secondary">승인대기</Badge>
                          )}
                          {request.status === "승인" && (
                            <Badge className="bg-green-600">승인</Badge>
                          )}
                          {request.status === "반려" && (
                            <div className="flex flex-col gap-1">
                              <Badge variant="destructive">반려</Badge>
                              {request.rejectionReason && (
                                <span className="text-xs text-muted-foreground">
                                  {request.rejectionReason}
                                </span>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {request.status === "승인대기" && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(request.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                승인
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openRejectDialog(request)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                반려
                              </Button>
                            </div>
                          )}
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

      {/* 반려 다이얼로그 */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>뱃지 등록 반려</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">반려 사유</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="반려 사유를 입력하세요"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              반려
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
