import { useState } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";
import { BadgeManagement } from "./components/BadgeManagement";
import { BadgeRegistration } from "./components/BadgeRegistration";
import { BadgeManualIssue } from "./components/BadgeManualIssue";
import { BadgeImageList } from "./components/BadgeImageList";
import { BadgeAcquisition } from "./components/BadgeAcquisition";
import { BadgeActivityLog } from "./components/BadgeActivityLog";
import { PermissionManagement } from "./components/PermissionManagement";
import { BadgeMissionManagement } from "./components/BadgeMissionManagement";
import { StudentListManagement } from "./components/StudentListManagement";
import { Toaster } from "./components/ui/sonner";
import { BadgeAcquisitionStatus } from "./components/BadgeAcquisitionStatus";
import { StudentView } from "./components/StudentView";

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
  status: "활성" | "승인대기" | "반려";
}

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

export default function App() {
  const [currentPage, setCurrentPage] = useState("badge-management");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"admin" | "student">("admin");
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 1,
      code: "BDGE001",
      name: "봉사왕",
      validFrom: new Date(2026, 0, 1),
      validTo: new Date(2030, 0, 1),
      academicStatus: "재학생",
      scope: "전체",
      analysisType: "봉사시간",
      criteriaValue: "30시간 이상",
      category: "봉사",
      description: "봉사활동 30시간 이상 달성 시 획득",
      imageFile: "badge-volunteer-30h.png",
      isActive: true,
    },
    {
      id: 2,
      code: "BDGE002",
      name: "완벽한 일주일",
      validFrom: new Date(2026, 3, 1),
      validTo: new Date(2026, 8, 31),
      academicStatus: "재학생",
      scope: "전체",
      analysisType: "출결",
      criteriaValue: "100%",
      category: "출결",
      description: "주간 출결 100% 달성 시 획득",
      imageFile: "badge-atten-100p.png",
      isActive: true,
    },
    {
      id: 3,
      code: "BDGE003",
      name: "JJ헤르미온느",
      validFrom: new Date(2026, 0, 1),
      validTo: new Date(2030, 0, 1),
      academicStatus: "재학생",
      scope: "전체",
      analysisType: "성적",
      criteriaValue: "4.3",
      category: "성적",
      description: "학기 성적 평균 4.3 이상 획득",
      imageFile: "badge-score-aplus.png",
      isActive: true,
    },
    {
      id: 4,
      code: "BDGE004",
      name: "광적인 책벌레",
      validFrom: new Date(2026, 0, 1),
      validTo: new Date(2030, 0, 1),
      academicStatus: "재학생",
      scope: "전체",
      analysisType: "도서대출",
      criteriaValue: "월 10권 이상",
      category: "독서",
      description: "한 달 동안 도서 10권 이상 대출",
      imageFile: "badge-reading-10books.png",
      isActive: true,
    },
    {
      id: 5,
      code: "BDGE005",
      name: "헬창",
      validFrom: new Date(2026, 2, 1),
      validTo: new Date(2026, 11, 31),
      academicStatus: "재학생",
      scope: "전체",
      analysisType: "체육활동",
      criteriaValue: "주 3회 이상",
      category: "체육",
      description: "주 3회 이상 체육 활동 참여",
      imageFile: "",
      isActive: true,
    },
    {
      id: 6,
      code: "BDGE006",
      name: "타고난 리더",
      validFrom: new Date(2026, 0, 1),
      validTo: new Date(2030, 0, 1),
      academicStatus: "재학생",
      scope: "전체",
      analysisType: "동아리활동",
      criteriaValue: "회장 3회 이상",
      category: "리더십",
      description: "동아리 회장 또는 학생회 임원 3회 이상",
      imageFile: "badge-leadership-3times.png",
      isActive: true,
    },
    {
      id: 7,
      code: "BDGE007",
      name: "아이디어 제조기",
      validFrom: new Date(2026, 0, 1),
      validTo: new Date(2030, 0, 1),
      academicStatus: "재학생",
      scope: "전체",
      analysisType: "특허출원",
      criteriaValue: "5건 이상",
      category: "창의",
      description: "특허 출원 또는 창업 경진대회 수상 5건 이상",
      imageFile: "badge-creativity-5projects.png",
      isActive: true,
    },
    {
      id: 8,
      code: "BDGE008",
      name: "세계는 내 무대",
      validFrom: new Date(2026, 0, 1),
      validTo: new Date(2030, 0, 1),
      academicStatus: "재학생",
      scope: "전체",
      analysisType: "어학성적",
      criteriaValue: "토익 900점 이상",
      category: "어학",
      description: "토익 900점 이상 또는 동등 어학 성적",
      imageFile: "badge-global-toeic900.png",
      isActive: true,
    },
    {
      id: 9,
      code: "BDGE009",
      name: "스펙 수집가",
      validFrom: new Date(2026, 0, 1),
      validTo: new Date(2030, 0, 1),
      academicStatus: "재학생",
      scope: "전체",
      analysisType: "자격증",
      criteriaValue: "3개 이상",
      category: "자격증",
      description: "전공 관련 자격증 3개 이상 취득",
      imageFile: "",
      isActive: false,
    },
    {
      id: 10,
      code: "BDGE010",
      name: "팀플의 신",
      validFrom: new Date(2026, 0, 1),
      validTo: new Date(2030, 0, 1),
      academicStatus: "재학생",
      scope: "전체",
      analysisType: "프로젝트",
      criteriaValue: "10건 이상",
      category: "프로젝트",
      description: "팀 프로젝트 10건 이상 완료",
      imageFile: "badge-project-10complete.png",
      isActive: false,
    },
    {
      id: 11,
      code: "EVTBDGE001",
      name: "2025 JJ 페스티벌",
      validFrom: new Date(2025, 7, 1),
      validTo: new Date(2030, 0, 1),
      academicStatus: "재학생",
      scope: "전체",
      analysisType: "이벤트 참여",
      criteriaValue: "축제 참여 인증",
      category: "이벤트",
      description: "2025년 하계 축제 참여",
      imageFile: "badge-event-festival2025.png",
      isActive: true,
    },
    {
      id: 12,
      code: "EVTBDGE002",
      name: "개교기념일 특별",
      validFrom: new Date(2026, 4, 1),
      validTo: new Date(2030, 0, 1),
      academicStatus: "재학생",
      scope: "전체",
      analysisType: "이벤트 참여",
      criteriaValue: "개교기념일 행사 참여",
      category: "이벤트",
      description: "개교기념일 특별 행사 참여",
      imageFile: "badge-event-anniversary.png",
      isActive: true,
    },
    {
      id: 13,
      code: "EVTBDGE003",
      name: "크리스마스 미션",
      validFrom: new Date(2025, 11, 1),
      validTo: new Date(2030, 0, 1),
      academicStatus: "재학생",
      scope: "전체",
      analysisType: "이벤트 참여",
      criteriaValue: "크리스마스 이벤트 완료",
      category: "이벤트",
      description: "크리스마스 특별 미션 완료",
      imageFile: "badge-event-christmas.png",
      isActive: true,
    },
  ]);

  const renderContent = () => {
    switch (currentPage) {
      case "badge-management":
        return <BadgeManagement badges={badges} setBadges={setBadges} />;
      case "badge-registration":
        return <BadgeRegistration />;
      case "badge-manual-issue":
        return <BadgeManualIssue />;
      case "badge-imagelist":
        return <BadgeImageList badges={badges} />;
      case "badge-acquisition":
        return <BadgeAcquisition />;
      case "badge-activity-log":
        return <BadgeActivityLog />;
      case "permission-management":
        return <PermissionManagement />;
      case "badge-mission":
        return <BadgeMissionManagement />;
      case "student-list":
        return <StudentListManagement />;
      case "jjcs-management":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">JJCS 기준관리</h1>
            <p className="text-muted-foreground mt-2">Coming soon...</p>
          </div>
        );
      case "scholarship-management":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">선도학생 관리</h1>
            <p className="text-muted-foreground mt-2">Coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">대시보드</h1>
            <p className="text-muted-foreground mt-2">환영합니다!</p>
          </div>
        );
    }
  };

  if (viewMode === "student") {
    return (
      <>
        <StudentView onSwitchToAdmin={() => setViewMode("admin")} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {isSidebarOpen && (
        <AdminSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onSwitchToStudent={() => setViewMode("student")}
        />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
      <Toaster />
    </div>
  );
}