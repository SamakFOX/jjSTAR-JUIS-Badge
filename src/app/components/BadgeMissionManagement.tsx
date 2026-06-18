import { useState } from "react";
import { Search, RefreshCw, Plus, Edit, Trash2, Trophy, Calendar, Gift } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface BadgeMission {
  id: number;
  code: string;
  name: string;
  description: string;
  missionType: "독서" | "봉사" | "출석" | "성적" | "체육" | "창의";
  targetValue: string;
  startDate: Date;
  endDate: Date;
  reward: string;
  scope: "전체" | "학과별";
  departmentTarget?: string;
  status: "승인대기" | "진행중" | "종료" | "반려";
  participants: number;
  registeredBy: string;
  registeredDepartment: string;
  rejectionReason?: string;
}

export function BadgeMissionManagement() {
  const [missions, setMissions] = useState<BadgeMission[]>([
    {
      id: 1,
      code: "MISSION2026S1",
      name: "2026 1학기 성적 우수상",
      description: "학기 평점 4.0 이상 달성 시 뱃지 + 장학금 지급",
      missionType: "성적",
      targetValue: "평점 4.0 이상",
      startDate: new Date(2026, 2, 1),
      endDate: new Date(2026, 7, 31),
      reward: "뱃지 + 장학금 100만원",
      scope: "전체",
      status: "진행중",
      participants: 234,
      registeredBy: "진돗개",
      registeredDepartment: "빅데이터센터",
    },
    {
      id: 2,
      code: "MISSION2026MIDTERM",
      name: "중간고사 완벽 출석 챌린지",
      description: "중간고사 기간 전 4주간 100% 출석",
      missionType: "출석",
      targetValue: "4주 연속 100% 출석",
      startDate: new Date(2026, 3, 1),
      endDate: new Date(2026, 4, 30),
      reward: "뱃지 + 문화상품권 5만원",
      scope: "전체",
      status: "진행중",
      participants: 567,
      registeredBy: "푸들푸들",
      registeredDepartment: "빅데이터센터",
    },
    {
      id: 3,
      code: "MISSION2026READ",
      name: "독서왕 선발대회",
      description: "한 달간 가장 많은 책 읽기",
      missionType: "독서",
      targetValue: "월간 최다 독서",
      startDate: new Date(2026, 4, 1),
      endDate: new Date(2026, 4, 31),
      reward: "뱃지 + 도서 구매권 10만원",
      scope: "전체",
      status: "진행중",
      participants: 189,
      registeredBy: "진돗개",
      registeredDepartment: "빅데이터센터",
    },
    {
      id: 4,
      code: "MISSION2026CSCODE",
      name: "컴공과 코딩 마라톤",
      description: "알고리즘 100문제 풀기",
      missionType: "창의",
      targetValue: "100문제 해결",
      startDate: new Date(2026, 4, 15),
      endDate: new Date(2026, 5, 15),
      reward: "뱃지 + 노트북",
      scope: "학과별",
      departmentTarget: "컴퓨터공학과",
      status: "승인대기",
      participants: 0,
      registeredBy: "밥도둑",
      registeredDepartment: "경찰학과",
    },
    {
      id: 5,
      code: "MISSION2026VOL",
      name: "여름방학 봉사활동 챌린지",
      description: "방학 기간 봉사활동 참여",
      missionType: "봉사",
      targetValue: "20시간 이상",
      startDate: new Date(2026, 6, 1),
      endDate: new Date(2026, 7, 31),
      reward: "뱃지 + 봉사활동 인증서",
      scope: "전체",
      status: "승인대기",
      participants: 0,
      registeredBy: "유리멘탈",
      registeredDepartment: "상담심리학과",
    },
    {
      id: 6,
      code: "MISSION2026FITNESS",
      name: "헬스 챌린지 2026",
      description: "2주간 매일 운동 인증하기",
      missionType: "체육",
      targetValue: "14일 연속 운동",
      startDate: new Date(2026, 4, 1),
      endDate: new Date(2026, 4, 14),
      reward: "뱃지",
      scope: "전체",
      status: "반려",
      participants: 0,
      registeredBy: "밥도둑",
      registeredDepartment: "경찰학과",
      rejectionReason: "정량적 평가 불가능",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<BadgeMission | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [newMission, setNewMission] = useState({
    name: "",
    code: "",
    description: "",
    missionType: "독서" as BadgeMission["missionType"],
    targetValue: "",
    startDate: "",
    endDate: "",
    reward: "",
    scope: "전체" as BadgeMission["scope"],
    departmentTarget: "",
  });

  const filteredMissions = missions.filter((mission) => {
    const matchesSearch =
      mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || mission.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleAddMission = () => {
    if (!newMission.name || !newMission.code || !newMission.startDate || !newMission.endDate) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }

    const mission: BadgeMission = {
      id: missions.length + 1,
      ...newMission,
      startDate: new Date(newMission.startDate),
      endDate: new Date(newMission.endDate),
      status: "진행중", // 관리자는 바로 진행중
      participants: 0,
      registeredBy: "진돗개",
      registeredDepartment: "빅데이터센터",
    };

    setMissions([mission, ...missions]);
    toast.success(`${newMission.name} 미션이 등록되었습니다.`);
    setIsAddDialogOpen(false);
    setNewMission({
      name: "",
      code: "",
      description: "",
      missionType: "독서",
      targetValue: "",
      startDate: "",
      endDate: "",
      reward: "",
      scope: "전체",
      departmentTarget: "",
    });
  };

  const handleApproveMission = (id: number) => {
    setMissions(
      missions.map((m) => (m.id === id ? { ...m, status: "진행중" as const } : m))
    );
    toast.success("미션이 승인되었습니다.");
  };

  const handleRejectMission = () => {
    if (!selectedMission || !rejectionReason) {
      toast.error("반려 사유를 입력해주세요.");
      return;
    }

    setMissions(
      missions.map((m) =>
        m.id === selectedMission.id
          ? { ...m, status: "반려" as const, rejectionReason }
          : m
      )
    );
    toast.success("미션이 반려되었습니다.");
    setIsRejectDialogOpen(false);
    setSelectedMission(null);
    setRejectionReason("");
  };

  const handleDeleteMission = (id: number) => {
    setMissions(missions.filter((m) => m.id !== id));
    toast.success("미션이 삭제되었습니다.");
  };

  const openRejectDialog = (mission: BadgeMission) => {
    setSelectedMission(mission);
    setIsRejectDialogOpen(true);
  };

  const statusCounts = {
    all: missions.length,
    진행중: missions.filter((m) => m.status === "진행중").length,
    승인대기: missions.filter((m) => m.status === "승인대기").length,
    종료: missions.filter((m) => m.status === "종료").length,
    반려: missions.filter((m) => m.status === "반려").length,
  };

  const totalParticipants = missions
    .filter((m) => m.status === "진행중")
    .reduce((sum, m) => sum + m.participants, 0);

  return (
    <div className="space-y-0">
      <PageBreadcrumb
        title="뱃지 미션"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "학생성공", href: "#" },
          { label: "뱃지 시스템", href: "#" },
          { label: "뱃지 미션" },
        ]}
        pageCode="NONMAJOR_BDG0107"
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  미션 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>새 미션 추가</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>미션 코드*</Label>
                      <Input
                        placeholder="MISSION2026XXX"
                        value={newMission.code}
                        onChange={(e) => setNewMission({ ...newMission, code: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>미션명*</Label>
                      <Input
                        placeholder="미션 이름"
                        value={newMission.name}
                        onChange={(e) => setNewMission({ ...newMission, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>설명</Label>
                    <Textarea
                      placeholder="미션 설명"
                      value={newMission.description}
                      onChange={(e) =>
                        setNewMission({ ...newMission, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>미션 유형</Label>
                      <Select
                        value={newMission.missionType}
                        onValueChange={(value) =>
                          setNewMission({
                            ...newMission,
                            missionType: value as BadgeMission["missionType"],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="독서">독서</SelectItem>
                          <SelectItem value="봉사">봉사</SelectItem>
                          <SelectItem value="출석">출석</SelectItem>
                          <SelectItem value="성적">성적</SelectItem>
                          <SelectItem value="체육">체육</SelectItem>
                          <SelectItem value="창의">창의</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>목표값</Label>
                      <Input
                        placeholder="예: 평점 4.0 이상"
                        value={newMission.targetValue}
                        onChange={(e) =>
                          setNewMission({ ...newMission, targetValue: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>시작일*</Label>
                      <Input
                        type="date"
                        value={newMission.startDate}
                        onChange={(e) =>
                          setNewMission({ ...newMission, startDate: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>종료일*</Label>
                      <Input
                        type="date"
                        value={newMission.endDate}
                        onChange={(e) =>
                          setNewMission({ ...newMission, endDate: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>보상</Label>
                    <Input
                      placeholder="예: 뱃지 + 장학금 100만원"
                      value={newMission.reward}
                      onChange={(e) => setNewMission({ ...newMission, reward: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>적용 범위</Label>
                      <Select
                        value={newMission.scope}
                        onValueChange={(value) =>
                          setNewMission({
                            ...newMission,
                            scope: value as BadgeMission["scope"],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="전체">전체</SelectItem>
                          <SelectItem value="학과별">학과별</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newMission.scope === "학과별" && (
                      <div className="space-y-2">
                        <Label>대상 학과</Label>
                        <Input
                          placeholder="예: 컴퓨터공학과"
                          value={newMission.departmentTarget}
                          onChange={(e) =>
                            setNewMission({ ...newMission, departmentTarget: e.target.value })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleAddMission}>추가</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">진행중 미션</CardTitle>
              <Trophy className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.진행중}</div>
              <p className="text-xs text-muted-foreground">현재 진행중</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">승인 대기</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{statusCounts.승인대기}</div>
              <p className="text-xs text-muted-foreground">승인 필요</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 참여자</CardTitle>
              <Gift className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalParticipants}</div>
              <p className="text-xs text-muted-foreground">진행중 미션 참여자</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">종료 미션</CardTitle>
              <Trophy className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{statusCounts.종료}</div>
              <p className="text-xs text-muted-foreground">완료된 미션</p>
            </CardContent>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 및 필터</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="미션명, 코드로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="진행중">진행중</SelectItem>
                  <SelectItem value="승인대기">승인대기</SelectItem>
                  <SelectItem value="종료">종료</SelectItem>
                  <SelectItem value="반려">반려</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 미션 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>미션 목록 ({filteredMissions.length}개)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>미션 코드</TableHead>
                    <TableHead>미션명</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>목표</TableHead>
                    <TableHead>기간</TableHead>
                    <TableHead>보상</TableHead>
                    <TableHead>범위</TableHead>
                    <TableHead>참여자</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-32">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMissions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="text-center py-8 text-muted-foreground"
                      >
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMissions.map((mission, index) => (
                      <TableRow key={mission.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">{mission.code}</TableCell>
                        <TableCell className="font-medium">{mission.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{mission.missionType}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{mission.targetValue}</TableCell>
                        <TableCell className="text-xs">
                          {format(mission.startDate, "yy.MM.dd", { locale: ko })} ~{" "}
                          {format(mission.endDate, "yy.MM.dd", { locale: ko })}
                        </TableCell>
                        <TableCell className="text-sm">{mission.reward}</TableCell>
                        <TableCell className="text-sm">
                          {mission.scope === "학과별"
                            ? mission.departmentTarget
                            : mission.scope}
                        </TableCell>
                        <TableCell className="text-center">{mission.participants}</TableCell>
                        <TableCell>
                          {mission.status === "진행중" && (
                            <Badge className="bg-green-600">진행중</Badge>
                          )}
                          {mission.status === "승인대기" && (
                            <Badge className="bg-orange-600">승인대기</Badge>
                          )}
                          {mission.status === "종료" && (
                            <Badge variant="secondary">종료</Badge>
                          )}
                          {mission.status === "반려" && (
                            <div className="relative group inline-block">
                              <Badge variant="destructive" className="cursor-help">
                                반려
                              </Badge>
                              {mission.rejectionReason && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                                  <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl">
                                    <div className="font-medium">반려사유:</div>
                                    <div>{mission.rejectionReason}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {mission.status === "승인대기" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApproveMission(mission.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  승인
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openRejectDialog(mission)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  반려
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteMission(mission.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>미션 반려</DialogTitle>
          </DialogHeader>
          {selectedMission && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 border rounded-lg p-3">
                <p className="text-sm">
                  <span className="font-medium">미션명:</span> {selectedMission.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">등록자:</span> {selectedMission.registeredBy} (
                  {selectedMission.registeredDepartment})
                </p>
              </div>

              <div className="space-y-2">
                <Label>반려 사유*</Label>
                <Textarea
                  placeholder="반려 사유를 입력해주세요"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleRejectMission}>
              반려
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
