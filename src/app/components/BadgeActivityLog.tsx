import { useState } from "react";
import { Search, RefreshCw, Award, User, Calendar, Filter } from "lucide-react";
import { PageBreadcrumb } from "./PageBreadcrumb";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface ActivityLog {
  id: number;
  action: "발급" | "회수";
  badgeCode: string;
  badgeName: string;
  studentId: string;
  studentName: string;
  department: string;
  issuerName: string;
  issuerDepartment: string;
  issuerRole: "관리자" | "교직원";
  reason: string;
  timestamp: Date;
}

// 샘플 로그 데이터 생성
const generateSampleLogs = (): ActivityLog[] => {
  const logs: ActivityLog[] = [
    {
      id: 1,
      action: "발급",
      badgeCode: "EVTBDGE001",
      badgeName: "2025 JJ 페스티벌",
      studentId: "20210001",
      studentName: "김철수",
      department: "컴퓨터공학과",
      issuerName: "진돗개",
      issuerDepartment: "빅데이터센터",
      issuerRole: "관리자",
      reason: "하계 축제 부스 운영 참여",
      timestamp: new Date(2026, 4, 14, 10, 30),
    },
    {
      id: 2,
      action: "발급",
      badgeCode: "BDGE001",
      badgeName: "봉사왕",
      studentId: "20220001",
      studentName: "박민수",
      department: "전자공학과",
      issuerName: "시스템",
      issuerDepartment: "자동발급",
      issuerRole: "관리자",
      reason: "봉사시간 35시간 달성",
      timestamp: new Date(2026, 4, 14, 9, 15),
    },
    {
      id: 3,
      action: "발급",
      badgeCode: "EVTBDGE002",
      badgeName: "개교기념일 특별",
      studentId: "20230001",
      studentName: "정수연",
      department: "디자인학과",
      issuerName: "밥도둑",
      issuerDepartment: "경찰학과",
      issuerRole: "교직원",
      reason: "개교기념일 행사 스태프 참여",
      timestamp: new Date(2026, 4, 13, 15, 45),
    },
    {
      id: 4,
      action: "회수",
      badgeCode: "BDGE006",
      badgeName: "타고난 리더",
      studentId: "20210002",
      studentName: "이영희",
      department: "경영학과",
      issuerName: "푸들푸들",
      issuerDepartment: "빅데이터센터",
      issuerRole: "관리자",
      reason: "학생회 임원 중도 사퇴로 인한 자격 박탈",
      timestamp: new Date(2026, 4, 13, 11, 20),
    },
    {
      id: 5,
      action: "발급",
      badgeCode: "BDGE003",
      badgeName: "JJ헤르미온느",
      studentId: "20240001",
      studentName: "최지훈",
      department: "컴퓨터공학과",
      issuerName: "시스템",
      issuerDepartment: "자동발급",
      issuerRole: "관리자",
      reason: "평점 4.35 달성",
      timestamp: new Date(2026, 4, 12, 14, 0),
    },
    {
      id: 6,
      action: "발급",
      badgeCode: "EVTBDGE003",
      badgeName: "크리스마스 미션",
      studentId: "20220002",
      studentName: "강민지",
      department: "심리학과",
      issuerName: "유리멘탈",
      issuerDepartment: "상담심리학과",
      issuerRole: "교직원",
      reason: "크리스마스 봉사활동 참여",
      timestamp: new Date(2026, 4, 11, 16, 30),
    },
    {
      id: 7,
      action: "발급",
      badgeCode: "BDGE002",
      badgeName: "완벽한 일주일",
      studentId: "20230002",
      studentName: "서예진",
      department: "화학과",
      issuerName: "시스템",
      issuerDepartment: "자동발급",
      issuerRole: "관리자",
      reason: "주간 출석률 100% 달성",
      timestamp: new Date(2026, 4, 10, 8, 0),
    },
  ];

  return logs;
};

export function BadgeActivityLog() {
  const [logs] = useState<ActivityLog[]>(generateSampleLogs());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.studentId.includes(searchTerm) ||
      log.badgeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.issuerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesRole = filterRole === "all" || log.issuerRole === filterRole;

    return matchesSearch && matchesAction && matchesRole;
  });

  const issueCount = logs.filter((l) => l.action === "발급").length;
  const revokeCount = logs.filter((l) => l.action === "회수").length;
  const manualIssueCount = logs.filter(
    (l) => l.action === "발급" && l.issuerDepartment !== "자동발급"
  ).length;

  return (
    <div className="space-y-0">
      <PageBreadcrumb
        title="뱃지 발급/회수 로그"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "학생성공", href: "#" },
          { label: "뱃지 관리", href: "#" },
          { label: "뱃지 발급/회수 로그" },
        ]}
        pageCode="NONMAJOR_BDG0105"
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 발급 건수</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{issueCount}</div>
              <p className="text-xs text-muted-foreground">전체 발급 내역</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 회수 건수</CardTitle>
              <Award className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{revokeCount}</div>
              <p className="text-xs text-muted-foreground">전체 회수 내역</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">수동 발급 건수</CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{manualIssueCount}</div>
              <p className="text-xs text-muted-foreground">관리자/교직원 발급</p>
            </CardContent>
          </Card>
        </div>

        {/* 필터 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              필터 및 검색
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="학생명, 학번, 뱃지명, 발급자로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="활동 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="발급">발급</SelectItem>
                  <SelectItem value="회수">회수</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="발급자 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="관리자">관리자</SelectItem>
                  <SelectItem value="교직원">교직원</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 로그 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle>활동 로그 ({filteredLogs.length}건)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>일시</TableHead>
                    <TableHead>활동</TableHead>
                    <TableHead>뱃지</TableHead>
                    <TableHead>학생</TableHead>
                    <TableHead>학과</TableHead>
                    <TableHead>발급자</TableHead>
                    <TableHead>소속</TableHead>
                    <TableHead>권한</TableHead>
                    <TableHead>사유</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-12 w-12 text-muted-foreground/50" />
                          <p>검색 결과가 없습니다.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log, index) => (
                      <TableRow key={log.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="text-sm">
                          {format(log.timestamp, "yyyy-MM-dd HH:mm", { locale: ko })}
                        </TableCell>
                        <TableCell>
                          {log.action === "발급" ? (
                            <Badge className="bg-green-600">발급</Badge>
                          ) : (
                            <Badge variant="destructive">회수</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{log.badgeName}</span>
                            <span className="text-xs text-muted-foreground">
                              {log.badgeCode}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{log.studentName}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {log.studentId}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{log.department}</TableCell>
                        <TableCell className="font-medium">{log.issuerName}</TableCell>
                        <TableCell className="text-sm">
                          {log.issuerDepartment}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              log.issuerRole === "관리자"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-600 text-white"
                            }
                          >
                            {log.issuerRole}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs text-sm">{log.reason}</TableCell>
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
