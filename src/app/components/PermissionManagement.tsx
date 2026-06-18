import { useState } from "react";
import { Search, RefreshCw, Shield, UserPlus, Edit, Trash2, Save, X } from "lucide-react";
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
import { toast } from "sonner";

interface Staff {
  id: number;
  name: string;
  staffId: string;
  department: string;
  role: "관리자" | "교직원" | "없음";
  email: string;
}

export function PermissionManagement() {
  const [staffList, setStaffList] = useState<Staff[]>([
    {
      id: 1,
      name: "진돗개",
      staffId: "S2021001",
      department: "빅데이터센터",
      role: "관리자",
      email: "jindo@jj.ac.kr",
    },
    {
      id: 2,
      name: "푸들푸들",
      staffId: "S2021002",
      department: "빅데이터센터",
      role: "관리자",
      email: "poodle@jj.ac.kr",
    },
    {
      id: 3,
      name: "삽살개",
      staffId: "S2022001",
      department: "정보통신지원실",
      role: "관리자",
      email: "sapsal@jj.ac.kr",
    },
    {
      id: 4,
      name: "밥도둑",
      staffId: "S2023001",
      department: "경찰학과",
      role: "교직원",
      email: "police@jj.ac.kr",
    },
    {
      id: 5,
      name: "유리멘탈",
      staffId: "S2023002",
      department: "상담심리학과",
      role: "교직원",
      email: "counsel@jj.ac.kr",
    },
    {
      id: 6,
      name: "김개똥",
      staffId: "S2024004",
      department: "빅데이터센터",
      role: "교직원",
      email: "kim@jj.ac.kr",
    },
    {
      id: 7,
      name: "말티즈",
      staffId: "S2024005",
      department: "빅데이터센터",
      role: "교직원",
      email: "maltese@jj.ac.kr",
    },
    {
      id: 8,
      name: "치와왕",
      staffId: "S2024006",
      department: "빅데이터센터",
      role: "교직원",
      email: "chihuahua@jj.ac.kr",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newStaffSearch, setNewStaffSearch] = useState("");
  const [selectedNewStaff, setSelectedNewStaff] = useState<Staff | null>(null);
  const [newRole, setNewRole] = useState<"관리자" | "교직원">("교직원");

  // 검색 가능한 교직원 목록 (권한이 없는 사람들)
  const availableStaff: Staff[] = [
    {
      id: 101,
      name: "김교수",
      staffId: "S2024001",
      department: "컴퓨터공학과",
      role: "없음",
      email: "kim@jj.ac.kr",
    },
    {
      id: 102,
      name: "이조교",
      staffId: "S2024002",
      department: "경영학과",
      role: "없음",
      email: "lee@jj.ac.kr",
    },
    {
      id: 103,
      name: "박직원",
      staffId: "S2024003",
      department: "학생처",
      role: "없음",
      email: "park@jj.ac.kr",
    },
  ];

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.staffId.includes(searchTerm) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAvailableStaff = availableStaff.filter(
    (staff) =>
      staff.name.toLowerCase().includes(newStaffSearch.toLowerCase()) ||
      staff.staffId.includes(newStaffSearch) ||
      staff.department.toLowerCase().includes(newStaffSearch.toLowerCase())
  );

  const handleAddPermission = () => {
    if (!selectedNewStaff) {
      toast.error("교직원을 선택해주세요.");
      return;
    }

    const newStaff: Staff = {
      ...selectedNewStaff,
      id: staffList.length + 1,
      role: newRole,
    };

    setStaffList([...staffList, newStaff]);
    toast.success(`${selectedNewStaff.name}님에게 ${newRole} 권한을 부여했습니다.`);

    setIsAddDialogOpen(false);
    setSelectedNewStaff(null);
    setNewStaffSearch("");
    setNewRole("교직원");
  };

  const handleEditPermission = () => {
    if (!editingStaff) return;

    setStaffList(
      staffList.map((staff) => (staff.id === editingStaff.id ? editingStaff : staff))
    );
    toast.success(`${editingStaff.name}님의 권한을 ${editingStaff.role}(으)로 변경했습니다.`);

    setIsEditDialogOpen(false);
    setEditingStaff(null);
  };

  const handleDeletePermission = (id: number) => {
    const staff = staffList.find((s) => s.id === id);
    if (staff) {
      setStaffList(staffList.filter((s) => s.id !== id));
      toast.success(`${staff.name}님의 권한을 삭제했습니다.`);
    }
  };

  const openEditDialog = (staff: Staff) => {
    setEditingStaff({ ...staff });
    setIsEditDialogOpen(true);
  };

  const adminCount = staffList.filter((s) => s.role === "관리자").length;
  const staffCount = staffList.filter((s) => s.role === "교직원").length;

  return (
    <div className="space-y-0">
      <PageBreadcrumb
        title="권한 관리"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "학생성공", href: "#" },
          { label: "뱃지 관리", href: "#" },
          { label: "권한 관리" },
        ]}
        pageCode="NONMAJOR_BDG0106"
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  권한 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>권한 추가</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>교직원 검색</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="이름 또는 직원번호로 검색"
                          value={newStaffSearch}
                          onChange={(e) => setNewStaffSearch(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>직원번호</TableHead>
                          <TableHead>이름</TableHead>
                          <TableHead>소속</TableHead>
                          <TableHead className="w-20">선택</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAvailableStaff.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              검색 결과가 없습니다.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAvailableStaff.map((staff) => (
                            <TableRow
                              key={staff.id}
                              className={`cursor-pointer ${
                                selectedNewStaff?.id === staff.id ? "bg-blue-50" : ""
                              }`}
                              onClick={() => setSelectedNewStaff(staff)}
                            >
                              <TableCell className="font-mono text-sm">
                                {staff.staffId}
                              </TableCell>
                              <TableCell className="font-medium">{staff.name}</TableCell>
                              <TableCell className="text-sm">{staff.department}</TableCell>
                              <TableCell>
                                {selectedNewStaff?.id === staff.id && (
                                  <Badge className="bg-blue-600">선택됨</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {selectedNewStaff && (
                    <div className="space-y-2">
                      <Label>부여할 권한</Label>
                      <Select
                        value={newRole}
                        onValueChange={(value) =>
                          setNewRole(value as "관리자" | "교직원")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="관리자">관리자</SelectItem>
                          <SelectItem value="교직원">교직원</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleAddPermission} disabled={!selectedNewStaff}>
                    추가
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 권한 수</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffList.length}</div>
              <p className="text-xs text-muted-foreground">전체 권한 보유자</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">관리자 권한</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{adminCount}</div>
              <p className="text-xs text-muted-foreground">관리자 권한 보유자</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">교직원 권한</CardTitle>
              <Shield className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{staffCount}</div>
              <p className="text-xs text-muted-foreground">교직원 권한 보유자</p>
            </CardContent>
          </Card>
        </div>

        {/* 검색 */}
        <Card>
          <CardHeader>
            <CardTitle>검색</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이름, 직원번호, 소속으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* 권한 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>권한 목록 ({filteredStaff.length}명)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>직원번호</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>소속</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>권한</TableHead>
                    <TableHead className="w-32">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStaff.map((staff, index) => (
                      <TableRow key={staff.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {staff.staffId}
                        </TableCell>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell className="text-sm">{staff.department}</TableCell>
                        <TableCell className="text-sm">{staff.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              staff.role === "관리자"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-600 text-white"
                            }
                          >
                            {staff.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(staff)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeletePermission(staff.id)}
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

      {/* 권한 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>권한 수정</DialogTitle>
          </DialogHeader>
          {editingStaff && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 border rounded-lg p-3">
                <p className="text-sm">
                  <span className="font-medium">이름:</span> {editingStaff.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">소속:</span> {editingStaff.department}
                </p>
              </div>

              <div className="space-y-2">
                <Label>권한</Label>
                <Select
                  value={editingStaff.role}
                  onValueChange={(value) =>
                    setEditingStaff({
                      ...editingStaff,
                      role: value as "관리자" | "교직원",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="관리자">관리자</SelectItem>
                    <SelectItem value="교직원">교직원</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEditPermission}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
