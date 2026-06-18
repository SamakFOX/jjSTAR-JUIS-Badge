import { Award, TrendingUp, Users, Calendar, Search, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PageBreadcrumb } from "./PageBreadcrumb";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface BadgeAcquisition {
  id: number;
  studentId: string;
  studentName: string;
  department: string;
  badgeCode: string;
  badgeName: string;
  acquisitionDate: Date;
  status: "획득" | "진행중";
}

interface BadgeAcquisitionStatusProps {
  acquisitions: BadgeAcquisition[];
}

export function BadgeAcquisitionStatus({ acquisitions }: BadgeAcquisitionStatusProps) {
  // 통계 계산
  const totalAcquisitions = acquisitions.length;
  const uniqueStudents = new Set(acquisitions.map((a) => a.studentId)).size;
  const uniqueBadges = new Set(acquisitions.map((a) => a.badgeCode)).size;
  const thisMonthAcquisitions = acquisitions.filter((a) => {
    const now = new Date();
    return (
      a.acquisitionDate.getMonth() === now.getMonth() &&
      a.acquisitionDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="space-y-0">
      <PageBreadcrumb
        title="뱃지 획득 현황"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "학생성공", href: "#" },
          { label: "뱃지 시스템", href: "#" },
          { label: "뱃지 획득 현황" },
        ]}
        pageCode="NONMAJOR_BDG0102"
        actions={
          <>
            <div className="flex items-center gap-2">
              <Input placeholder="학생명 또는 뱃지명 검색..." className="w-64" />
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 획득 수</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAcquisitions}</div>
              <p className="text-xs text-muted-foreground">전체 뱃지 획득 건수</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">참여 학생 수</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueStudents}</div>
              <p className="text-xs text-muted-foreground">뱃지를 획득한 학생</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">배포된 뱃지 종류</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueBadges}</div>
              <p className="text-xs text-muted-foreground">획득된 뱃지 종류</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">이번 달 획득</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisMonthAcquisitions}</div>
              <p className="text-xs text-muted-foreground">
                {format(new Date(), "yyyy년 M월", { locale: ko })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 획득 현황 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle>뱃지 획득 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>학번</TableHead>
                    <TableHead>학생명</TableHead>
                    <TableHead>학과</TableHead>
                    <TableHead>뱃지코드</TableHead>
                    <TableHead>뱃지명</TableHead>
                    <TableHead>획득일시</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {acquisitions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Award className="h-12 w-12 text-muted-foreground/50" />
                          <p className="text-muted-foreground">
                            뱃지 획득 내역이 없습니다.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    acquisitions.map((acquisition, index) => (
                      <TableRow key={acquisition.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {acquisition.studentId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {acquisition.studentName}
                        </TableCell>
                        <TableCell>{acquisition.department}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {acquisition.badgeCode}
                        </TableCell>
                        <TableCell>{acquisition.badgeName}</TableCell>
                        <TableCell>
                          {format(acquisition.acquisitionDate, "yyyy-MM-dd HH:mm", {
                            locale: ko,
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              acquisition.status === "획득" ? "default" : "secondary"
                            }
                          >
                            {acquisition.status}
                          </Badge>
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
