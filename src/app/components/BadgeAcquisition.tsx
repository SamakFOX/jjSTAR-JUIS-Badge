import { useState } from "react";
import { Award, TrendingUp, Users, Calendar, Search, RefreshCw, Filter } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AcquisitionRecord {
  id: number;
  studentId: string;
  studentName: string;
  department: string;
  badgeCode: string;
  badgeName: string;
  badgeCategory: string;
  acquisitionDate: Date;
  criteriaValue: string;
  achievedValue: string;
}

// 샘플 데이터 생성
const generateSampleData = (): AcquisitionRecord[] => {
  const students = [
    { id: "20210001", name: "김철수", dept: "컴퓨터공학과" },
    { id: "20210002", name: "이영희", dept: "경영학과" },
    { id: "20210003", name: "박민수", dept: "전자공학과" },
    { id: "20210004", name: "정수연", dept: "디자인학과" },
    { id: "20220001", name: "최지훈", dept: "컴퓨터공학과" },
    { id: "20220002", name: "강민지", dept: "심리학과" },
    { id: "20220003", name: "임태양", dept: "기계공학과" },
    { id: "20220004", name: "윤서영", dept: "국어국문학과" },
    { id: "20230001", name: "한도윤", dept: "경제학과" },
    { id: "20230002", name: "서예진", dept: "화학과" },
    { id: "20230003", name: "오준호", dept: "물리학과" },
    { id: "20230004", name: "권나라", dept: "건축학과" },
    { id: "20240001", name: "장하늘", dept: "컴퓨터공학과" },
    { id: "20240002", name: "신우주", dept: "생명공학과" },
    { id: "20240003", name: "조은별", dept: "수학과" },
    { id: "20240004", name: "배준서", dept: "경영학과" },
    { id: "20240005", name: "노시우", dept: "전자공학과" },
    { id: "20230005", name: "안유진", dept: "디자인학과" },
    { id: "20230006", name: "문재인", dept: "컴퓨터공학과" },
    { id: "20220005", name: "송혜교", dept: "심리학과" },
  ];

  // JJ헤르미온느가 1위가 되도록 가중치 설정
  const badges = [
    { code: "BDGE003", name: "JJ헤르미온느", category: "성적", criteria: "4.3", weight: 25 },
    { code: "BDGE002", name: "완벽한 일주일", category: "출결", criteria: "100%", weight: 15 },
    { code: "BDGE001", name: "봉사왕", category: "봉사", criteria: "30시간 이상", weight: 12 },
    { code: "BDGE004", name: "광적인 책벌레", category: "독서", criteria: "월 10권 이상", weight: 10 },
    { code: "BDGE007", name: "아이디어 제조기", category: "창의", criteria: "5건 이상", weight: 10 },
    { code: "BDGE006", name: "타고난 리더", category: "리더십", criteria: "3회 이상", weight: 8 },
    { code: "BDGE008", name: "세계는 내 무대", category: "어학", criteria: "토익 900점 이상", weight: 5 },
  ];

  const records: AcquisitionRecord[] = [];
  const today = new Date();

  // 80개 레코드 생성 (한 학기 = 6개월)
  for (let i = 0; i < 80; i++) {
    const student = students[Math.floor(Math.random() * students.length)];

    // 가중치에 따라 뱃지 선택
    const totalWeight = badges.reduce((sum, b) => sum + b.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedBadge = badges[0];

    for (const badge of badges) {
      random -= badge.weight;
      if (random <= 0) {
        selectedBadge = badge;
        break;
      }
    }

    // 한 학기 기간 (최근 6개월) 내에서 랜덤 날짜 생성
    const daysAgo = Math.floor(Math.random() * 180);
    const acquisitionDate = new Date(today);
    acquisitionDate.setDate(today.getDate() - daysAgo);

    let achievedValue = "";
    if (selectedBadge.category === "봉사") {
      achievedValue = `${30 + Math.floor(Math.random() * 20)}시간`;
    } else if (selectedBadge.category === "출결") {
      achievedValue = "100%";
    } else if (selectedBadge.category === "성적") {
      achievedValue = (4.3 + Math.random() * 0.2).toFixed(2);
    } else if (selectedBadge.category === "독서") {
      achievedValue = `${10 + Math.floor(Math.random() * 5)}권`;
    } else if (selectedBadge.category === "리더십") {
      achievedValue = `${3 + Math.floor(Math.random() * 3)}회`;
    } else if (selectedBadge.category === "창의") {
      achievedValue = `${5 + Math.floor(Math.random() * 5)}건`;
    } else if (selectedBadge.category === "어학") {
      achievedValue = `${900 + Math.floor(Math.random() * 90)}점`;
    }

    records.push({
      id: i + 1,
      studentId: student.id,
      studentName: student.name,
      department: student.dept,
      badgeCode: selectedBadge.code,
      badgeName: selectedBadge.name,
      badgeCategory: selectedBadge.category,
      acquisitionDate,
      criteriaValue: selectedBadge.criteria,
      achievedValue,
    });
  }

  return records.sort((a, b) => b.acquisitionDate.getTime() - a.acquisitionDate.getTime());
};

export function BadgeAcquisition() {
  const [records] = useState<AcquisitionRecord[]>(generateSampleData());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<string>("all");

  // 통계 계산
  const totalAcquisitions = records.length;
  const uniqueStudents = new Set(records.map((r) => r.studentId)).size;
  const thisMonthRecords = records.filter((r) => {
    const now = new Date();
    return (
      r.acquisitionDate.getMonth() === now.getMonth() &&
      r.acquisitionDate.getFullYear() === now.getFullYear()
    );
  });
  const monthlyGrowth = thisMonthRecords.length;

  const badgeDistribution = records.reduce((acc, record) => {
    acc[record.badgeName] = (acc[record.badgeName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topBadge = Object.entries(badgeDistribution).sort((a, b) => b[1] - a[1])[0];

  // 인기 뱃지 TOP 5 데이터
  const topBadgesData = Object.entries(badgeDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
    }));

  // 월별 학과별 누적 데이터 생성
  const monthlyDepartmentData = (() => {
    const months = ["11월", "12월", "1월", "2월", "3월", "4월", "5월"];
    const departments = ["컴퓨터공학과", "경영학과", "전자공학과", "디자인학과", "심리학과"];
    const deptColors = {
      "컴퓨터공학과": "#3b82f6",
      "경영학과": "#ef4444",
      "전자공학과": "#10b981",
      "디자인학과": "#f59e0b",
      "심리학과": "#8b5cf6",
    };

    const monthlyData = months.map((month, monthIndex) => {
      const data: any = { month };
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - (6 - monthIndex));
      startDate.setDate(1);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      departments.forEach((dept) => {
        const deptRecords = records.filter(
          (r) =>
            r.department === dept &&
            r.acquisitionDate >= startDate &&
            r.acquisitionDate < endDate
        );
        data[dept] = deptRecords.length;
      });

      return data;
    });

    // 누적 데이터로 변환
    const cumulativeData = monthlyData.map((monthData, index) => {
      const cumulative: any = { month: monthData.month };
      departments.forEach((dept) => {
        cumulative[dept] = monthlyData
          .slice(0, index + 1)
          .reduce((sum, m) => sum + (m[dept] || 0), 0);
      });
      return cumulative;
    });

    return { data: cumulativeData, departments, colors: deptColors };
  })();

  // 필터링
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.includes(searchTerm) ||
      record.badgeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBadge = selectedBadge === "all" || record.badgeName === selectedBadge;
    return matchesSearch && matchesBadge;
  });

  return (
    <div className="space-y-0">
      <PageBreadcrumb
        title="뱃지 획득 현황"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "학생성공", href: "#" },
          { label: "뱃지 관리", href: "#" },
          { label: "뱃지 획득 현황" },
        ]}
        pageCode="NONMAJOR_BDG0102"
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* 그래프 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* 월별 학과별 누적 획득 수 (3/4 너비) */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>월별 학과별 뱃지 누적 획득 추이</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyDepartmentData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {monthlyDepartmentData.departments.map((dept) => (
                    <Line
                      key={dept}
                      type="monotone"
                      dataKey={dept}
                      stroke={monthlyDepartmentData.colors[dept as keyof typeof monthlyDepartmentData.colors]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 인기 뱃지 TOP 5 (1/4 너비) */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>인기 뱃지 TOP 5</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topBadgesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 획득 건수</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAcquisitions}</div>
              <p className="text-xs text-muted-foreground">전체 뱃지 획득 횟수</p>
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
              <CardTitle className="text-sm font-medium">이번 달 획득</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyGrowth}</div>
              <p className="text-xs text-muted-foreground">
                {new Date().getMonth() + 1}월 획득 건수
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">인기 뱃지</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topBadge?.[0] || "-"}</div>
              <p className="text-xs text-muted-foreground">
                {topBadge?.[1] || 0}회 획득
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 필터 및 검색 */}
        <Card>
          <CardHeader>
            <CardTitle>획득 현황 필터</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="학생명, 학번, 뱃지명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedBadge} onValueChange={setSelectedBadge}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="뱃지 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 뱃지</SelectItem>
                  {Object.keys(badgeDistribution).map((badgeName) => (
                    <SelectItem key={badgeName} value={badgeName}>
                      {badgeName} ({badgeDistribution[badgeName]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 획득 현황 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle>획득 내역 ({filteredRecords.length}건)</CardTitle>
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
                    <TableHead>뱃지명</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>기준값</TableHead>
                    <TableHead>달성값</TableHead>
                    <TableHead>획득일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-12 w-12 text-muted-foreground/50" />
                          <p>검색 결과가 없습니다.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record, index) => (
                      <TableRow key={record.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {record.studentId}
                        </TableCell>
                        <TableCell className="font-medium">{record.studentName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {record.department}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-yellow-600" />
                            <span>{record.badgeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{record.badgeCategory}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{record.criteriaValue}</TableCell>
                        <TableCell className="font-medium text-blue-600">
                          {record.achievedValue}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(record.acquisitionDate, "yyyy-MM-dd HH:mm", {
                            locale: ko,
                          })}
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
