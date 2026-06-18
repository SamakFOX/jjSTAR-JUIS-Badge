import { useState } from "react";
import { Search, RefreshCw, Award, User, Send } from "lucide-react";
import { PageBreadcrumb } from "./PageBreadcrumb";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  department: string;
  grade: number;
  status: string;
}

interface AvailableBadge {
  code: string;
  name: string;
  category: string;
  description: string;
}

export function BadgeManualIssue() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBadge, setSelectedBadge] = useState("");
  const [issueNote, setIssueNote] = useState("");

  // 샘플 학생 데이터
  const students: Student[] = [
    { id: "20210001", name: "김철수", department: "컴퓨터공학과", grade: 4, status: "재학" },
    { id: "20210002", name: "이영희", department: "경영학과", grade: 4, status: "재학" },
    { id: "20220001", name: "박민수", department: "전자공학과", grade: 3, status: "재학" },
    { id: "20230001", name: "정수연", department: "디자인학과", grade: 2, status: "재학" },
    { id: "20240001", name: "최지훈", department: "컴퓨터공학과", grade: 1, status: "재학" },
  ];

  // 수동 발급 가능한 뱃지 목록 (이벤트, 특별 뱃지 등)
  const availableBadges: AvailableBadge[] = [
    { code: "EVTBDGE001", name: "2025 JJ 페스티벌", category: "이벤트", description: "2025년 하계 축제 참여" },
    { code: "EVTBDGE002", name: "개교기념일 특별", category: "이벤트", description: "개교기념일 특별 행사 참여" },
    { code: "EVTBDGE003", name: "크리스마스 미션", category: "이벤트", description: "크리스마스 특별 미션 완료" },
    { code: "BDGE006", name: "타고난 리더", category: "리더십", description: "동아리 회장 또는 학생회 임원 3회 이상" },
    { code: "BDGE001", name: "봉사왕", category: "봉사", description: "봉사활동 30시간 이상 달성 시 획득" },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.includes(searchTerm) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleIssue = () => {
    if (!selectedStudent || !selectedBadge) {
      toast.error("학생과 뱃지를 모두 선택해주세요.");
      return;
    }

    const badge = availableBadges.find((b) => b.code === selectedBadge);
    toast.success(
      `${selectedStudent.name} 학생에게 "${badge?.name}" 뱃지를 발급했습니다.`
    );

    // 초기화
    setSelectedStudent(null);
    setSelectedBadge("");
    setIssueNote("");
    setSearchTerm("");
  };

  return (
    <div className="space-y-0">
      <PageBreadcrumb
        title="뱃지 수동발급"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "학생성공", href: "#" },
          { label: "뱃지 관리", href: "#" },
          { label: "뱃지 수동발급" },
        ]}
        pageCode="NONMAJOR_BDG0104"
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* 안내 문구 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>수동 발급 안내:</strong> 정량적 데이터로 자동 발급할 수 없는 뱃지(이벤트 참여, 특별 활동 등)를 학생에게 직접 발급할 수 있습니다.
            발급 시 비고란에 발급 사유를 명확히 기재해주시기 바랍니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 학생 검색 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                학생 검색
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="학번, 이름, 학과로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="border rounded-lg max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>학번</TableHead>
                      <TableHead>이름</TableHead>
                      <TableHead>학과</TableHead>
                      <TableHead>학년</TableHead>
                      <TableHead className="w-20">선택</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow
                          key={student.id}
                          className={`cursor-pointer ${
                            selectedStudent?.id === student.id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleStudentSelect(student)}
                        >
                          <TableCell className="font-mono text-sm">{student.id}</TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell className="text-sm">{student.department}</TableCell>
                          <TableCell className="text-sm">{student.grade}학년</TableCell>
                          <TableCell>
                            {selectedStudent?.id === student.id && (
                              <Badge className="bg-blue-600">선택됨</Badge>
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

          {/* 뱃지 선택 및 발급 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                뱃지 발급
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedStudent ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-900 font-medium mb-2">선택된 학생</p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">학번:</span> {selectedStudent.id}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">이름:</span> {selectedStudent.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">학과:</span> {selectedStudent.department}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    좌측에서 학생을 선택해주세요
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="badge">발급할 뱃지</Label>
                <Select value={selectedBadge} onValueChange={setSelectedBadge}>
                  <SelectTrigger>
                    <SelectValue placeholder="뱃지를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBadges.map((badge) => (
                      <SelectItem key={badge.code} value={badge.code}>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={
                              badge.category === "이벤트"
                                ? "bg-purple-600 text-white"
                                : "bg-blue-600 text-white"
                            }
                          >
                            {badge.category}
                          </Badge>
                          <span>{badge.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBadge && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900">
                    {availableBadges.find((b) => b.code === selectedBadge)?.description}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="note">발급 사유 (비고)</Label>
                <Textarea
                  id="note"
                  value={issueNote}
                  onChange={(e) => setIssueNote(e.target.value)}
                  placeholder="발급 사유를 입력하세요 (예: 2025년 하계 축제 부스 운영 참여)"
                  rows={4}
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleIssue}
                disabled={!selectedStudent || !selectedBadge}
              >
                <Send className="mr-2 h-4 w-4" />
                뱃지 발급하기
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 발급 가능한 뱃지 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>발급 가능한 뱃지 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableBadges.map((badge) => (
                <div
                  key={badge.code}
                  className={`border rounded-lg p-4 ${
                    badge.category === "이벤트"
                      ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        badge.category === "이벤트"
                          ? "bg-gradient-to-br from-purple-400 to-pink-500"
                          : "bg-gradient-to-br from-yellow-400 to-yellow-600"
                      }`}
                    >
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{badge.name}</h3>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            badge.category === "이벤트"
                              ? "bg-purple-600 text-white"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {badge.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{badge.code}</p>
                      <p className="text-sm">{badge.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
