import { useState } from "react";
import { Award, Lock, Star, TrendingUp, Trophy, Zap, BookOpen, Heart, Dumbbell, Crown, Lightbulb, Globe2, GraduationCap, Users, Sparkles, Flame, Target, Medal, Gift, Calendar, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import studentLogo from "../../images/jjstarLogo.png";
import festivalBadge from "../../images/2025festa.png";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface StudentBadge {
  id: number;
  code: string;
  name: string;
  description: string;
  category: "학업" | "활동" | "이벤트" | "히든";
  tier: "common" | "rare" | "epic" | "legendary" | "hidden";
  scope: "전체" | "컴퓨터공학과" | "경영학과" | "디자인학과";
  acquired: boolean;
  progress: number; // 0-100
  maxProgress: number;
  currentValue: number;
  icon: string;
  chain?: number[]; // 연계 뱃지 ID
}

interface Mission {
  id: number;
  code: string;
  name: string;
  description: string;
  type: string;
  targetValue: string;
  startDate: Date;
  endDate: Date;
  reward: string;
  myProgress: number;
  myRank: number | null;
  myDepartmentRank: number | null;
  isParticipating: boolean;
}

interface RankingEntry {
  rank: number;
  studentName: string;
  department: string;
  progress: number;
  isMe: boolean;
}

interface BadgeIconProps {
  icon: string;
}

const BadgeIcon = ({ icon }: BadgeIconProps) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    medal: <Medal className="h-10 w-10" />,
    trophy: <Trophy className="h-10 w-10" />,
    star: <Star className="h-10 w-10" />,
    target: <Target className="h-10 w-10" />,
    book: <BookOpen className="h-10 w-10" />,
    heart: <Heart className="h-10 w-10" />,
    dumbbell: <Dumbbell className="h-10 w-10" />,
    crown: <Crown className="h-10 w-10" />,
    lightbulb: <Lightbulb className="h-10 w-10" />,
    globe: <Globe2 className="h-10 w-10" />,
    graduation: <GraduationCap className="h-10 w-10" />,
    users: <Users className="h-10 w-10" />,
    sparkles: <Sparkles className="h-10 w-10" />,
    flame: <Flame className="h-10 w-10" />,
    award: <Award className="h-10 w-10" />,
    zap: <Zap className="h-10 w-10" />,
    lock: <Lock className="h-10 w-10" />,
  };

  return <>{iconMap[icon] || <Award className="h-10 w-10" />}</>;
};

// 미션 샘플 데이터
const activeMissions: Mission[] = [
  {
    id: 1,
    code: "MISSION2026S1",
    name: "2026 1학기 성적 우수상",
    description: "학기 평점 4.0 이상 달성 시 뱃지 + 장학금 지급",
    type: "성적",
    targetValue: "평점 4.0",
    startDate: new Date(2026, 2, 1),
    endDate: new Date(2026, 7, 31),
    reward: "뱃지 + 장학금 100만원",
    myProgress: 4.2,
    myRank: 3,
    myDepartmentRank: 1,
    isParticipating: true,
  },
  {
    id: 2,
    code: "MISSION2026MIDTERM",
    name: "중간고사 완벽 출석 챌린지",
    description: "중간고사 기간 전 4주간 100% 출석",
    type: "출석",
    targetValue: "4주 연속",
    startDate: new Date(2026, 3, 1),
    endDate: new Date(2026, 4, 30),
    reward: "뱃지 + 문화상품권 5만원",
    myProgress: 2,
    myRank: 45,
    myDepartmentRank: 8,
    isParticipating: true,
  },
  {
    id: 3,
    code: "MISSION2026READ",
    name: "독서왕 선발대회",
    description: "한 달간 가장 많은 책 읽기",
    type: "독서",
    targetValue: "월간 최다",
    startDate: new Date(2026, 4, 1),
    endDate: new Date(2026, 4, 31),
    reward: "뱃지 + 도서 구매권 10만원",
    myProgress: 8,
    myRank: 12,
    myDepartmentRank: 3,
    isParticipating: true,
  },
];

// 랭킹 샘플 데이터
// 이름 마스킹 함수
const maskName = (name: string): string => {
  if (name.length <= 1) return name;
  return name[0] + '*'.repeat(name.length - 1);
};

const getMissionRankings = (missionId: number): { overall: RankingEntry[]; department: RankingEntry[] } => {
  if (missionId === 1) {
    return {
      overall: [
        { rank: 1, studentName: maskName("박지성"), department: "경영학과", progress: 4.5, isMe: false },
        { rank: 2, studentName: maskName("이영희"), department: "컴퓨터공학과", progress: 4.4, isMe: false },
        { rank: 3, studentName: "김철수", department: "컴퓨터공학과", progress: 4.2, isMe: true },
        { rank: 4, studentName: maskName("최민수"), department: "디자인학과", progress: 4.1, isMe: false },
        { rank: 5, studentName: maskName("정수연"), department: "경영학과", progress: 4.0, isMe: false },
      ],
      department: [
        { rank: 1, studentName: "김철수", department: "컴퓨터공학과", progress: 4.2, isMe: true },
        { rank: 2, studentName: maskName("이영희"), department: "컴퓨터공학과", progress: 4.4, isMe: false },
        { rank: 3, studentName: maskName("강동원"), department: "컴퓨터공학과", progress: 3.9, isMe: false },
        { rank: 4, studentName: maskName("송혜교"), department: "컴퓨터공학과", progress: 3.8, isMe: false },
        { rank: 5, studentName: maskName("전지현"), department: "컴퓨터공학과", progress: 3.7, isMe: false },
      ],
    };
  } else if (missionId === 2) {
    return {
      overall: [
        { rank: 1, studentName: maskName("출석왕"), department: "경영학과", progress: 4, isMe: false },
        { rank: 2, studentName: maskName("개근상"), department: "디자인학과", progress: 4, isMe: false },
        { rank: 3, studentName: maskName("성실맨"), department: "컴퓨터공학과", progress: 3, isMe: false },
        { rank: 4, studentName: "김철수", department: "컴퓨터공학과", progress: 2, isMe: true },
        { rank: 5, studentName: maskName("열정이"), department: "경영학과", progress: 2, isMe: false },
      ],
      department: [
        { rank: 1, studentName: maskName("성실맨"), department: "컴퓨터공학과", progress: 3, isMe: false },
        { rank: 2, studentName: "김철수", department: "컴퓨터공학과", progress: 2, isMe: true },
        { rank: 3, studentName: maskName("최고다"), department: "컴퓨터공학과", progress: 2, isMe: false },
        { rank: 4, studentName: maskName("화이팅"), department: "컴퓨터공학과", progress: 1, isMe: false },
        { rank: 5, studentName: maskName("열심이"), department: "컴퓨터공학과", progress: 1, isMe: false },
      ],
    };
  } else if (missionId === 3) {
    return {
      overall: [
        { rank: 1, studentName: maskName("독서광"), department: "문헌정보학과", progress: 25, isMe: false },
        { rank: 2, studentName: maskName("책벌레킹"), department: "국문학과", progress: 22, isMe: false },
        { rank: 3, studentName: maskName("리더왕"), department: "경영학과", progress: 18, isMe: false },
        { rank: 4, studentName: maskName("북러버"), department: "컴퓨터공학과", progress: 15, isMe: false },
        { rank: 5, studentName: "김철수", department: "컴퓨터공학과", progress: 8, isMe: true },
      ],
      department: [
        { rank: 1, studentName: maskName("북러버"), department: "컴퓨터공학과", progress: 15, isMe: false },
        { rank: 2, studentName: maskName("독서맨"), department: "컴퓨터공학과", progress: 12, isMe: false },
        { rank: 3, studentName: "김철수", department: "컴퓨터공학과", progress: 8, isMe: true },
        { rank: 4, studentName: maskName("도서관킹"), department: "컴퓨터공학과", progress: 7, isMe: false },
        { rank: 5, studentName: maskName("책덕후"), department: "컴퓨터공학과", progress: 6, isMe: false },
      ],
    };
  }
  return { overall: [], department: [] };
};

const studentBadges: StudentBadge[] = [
  // 학업 - 스킬트리 형태
  {
    id: 1,
    code: "GRADE_BRONZE",
    name: "JJ론",
    description: "평점 3.5 이상 달성",
    category: "학업",
    tier: "common",
    scope: "전체",
    acquired: true,
    progress: 100,
    maxProgress: 3.5,
    currentValue: 3.8,
    icon: "medal",
    chain: [2],
  },
  {
    id: 2,
    code: "GRADE_SILVER",
    name: "JJ해리",
    description: "평점 4.0 이상 달성",
    category: "학업",
    tier: "rare",
    scope: "전체",
    acquired: true,
    progress: 100,
    maxProgress: 4.0,
    currentValue: 4.2,
    icon: "medal",
    chain: [3],
  },
  {
    id: 3,
    code: "GRADE_GOLD",
    name: "JJ헤르미온느",
    description: "평점 4.3 이상 달성",
    category: "학업",
    tier: "epic",
    scope: "전체",
    acquired: false,
    progress: 98,
    maxProgress: 4.3,
    currentValue: 4.2,
    icon: "trophy",
  },
  {
    id: 4,
    code: "ATTEND_1",
    name: "완벽한 일주일",
    description: "주간 출석률 100%",
    category: "학업",
    tier: "common",
    scope: "전체",
    acquired: true,
    progress: 100,
    maxProgress: 1,
    currentValue: 1,
    icon: "target",
    chain: [5],
  },
  {
    id: 5,
    code: "ATTEND_2",
    name: "완벽한 한달",
    description: "연속 4주 출석률 100%",
    category: "학업",
    tier: "rare",
    scope: "전체",
    acquired: false,
    progress: 50,
    maxProgress: 4,
    currentValue: 2,
    icon: "star",
    chain: [21],
  },
  {
    id: 21,
    code: "ATTEND_3",
    name: "완벽한 한 학기",
    description: "한 학기 출석률 100%",
    category: "학업",
    tier: "epic",
    scope: "전체",
    acquired: false,
    progress: 13,
    maxProgress: 15,
    currentValue: 2,
    icon: "trophy",
  },
  // 독서 스킬트리
  {
    id: 6,
    code: "READ_1",
    name: "독서 입문자",
    description: "월 10권 대출",
    category: "활동",
    tier: "common",
    scope: "전체",
    acquired: true,
    progress: 100,
    maxProgress: 10,
    currentValue: 12,
    icon: "book",
    chain: [7],
  },
  {
    id: 7,
    code: "READ_2",
    name: "책벌레",
    description: "월 20권 대출",
    category: "활동",
    tier: "rare",
    scope: "전체",
    acquired: false,
    progress: 40,
    maxProgress: 20,
    currentValue: 8,
    icon: "book",
    chain: [8],
  },
  {
    id: 8,
    code: "READ_3",
    name: "광적인 책벌레",
    description: "월 30권 대출",
    category: "활동",
    tier: "epic",
    scope: "전체",
    acquired: false,
    progress: 27,
    maxProgress: 30,
    currentValue: 8,
    icon: "flame",
  },
  // 봉사 스킬트리
  {
    id: 9,
    code: "VOL_1",
    name: "봉사 시작",
    description: "봉사 10시간",
    category: "활동",
    tier: "common",
    scope: "전체",
    acquired: true,
    progress: 100,
    maxProgress: 10,
    currentValue: 15,
    icon: "heart",
    chain: [10],
  },
  {
    id: 10,
    code: "VOL_2",
    name: "봉사왕",
    description: "봉사 30시간",
    category: "활동",
    tier: "rare",
    scope: "전체",
    acquired: true,
    progress: 100,
    maxProgress: 30,
    currentValue: 35,
    icon: "heart",
    chain: [11],
  },
  {
    id: 11,
    code: "VOL_3",
    name: "봉사의 전설",
    description: "봉사 50시간",
    category: "활동",
    tier: "legendary",
    scope: "전체",
    acquired: false,
    progress: 70,
    maxProgress: 50,
    currentValue: 35,
    icon: "crown",
  },
  // 이벤트 뱃지
  {
    id: 12,
    code: "EVENT_FESTIVAL",
    name: "2025 JJ 페스티벌",
    description: "하계 축제 참여 인증",
    category: "이벤트",
    tier: "epic",
    scope: "전체",
    acquired: true,
    progress: 100,
    maxProgress: 1,
    currentValue: 1,
    icon: "sparkles",
  },
  {
    id: 13,
    code: "EVENT_CHRISTMAS",
    name: "크리스마스 미션",
    description: "크리스마스 특별 미션 완료",
    category: "이벤트",
    tier: "rare",
    scope: "전체",
    acquired: false,
    progress: 0,
    maxProgress: 1,
    currentValue: 0,
    icon: "sparkles",
  },
  // 히든 뱃지
  {
    id: 14,
    code: "HIDDEN_NIGHT",
    name: "밤샘의 달인",
    description: "???",
    category: "히든",
    tier: "hidden",
    scope: "전체",
    acquired: false,
    progress: 33,
    maxProgress: 3,
    currentValue: 1,
    icon: "lock",
  },
  {
    id: 15,
    code: "HIDDEN_LEGEND",
    name: "???",
    description: "???",
    category: "히든",
    tier: "hidden",
    scope: "전체",
    acquired: false,
    progress: 0,
    maxProgress: 1,
    currentValue: 0,
    icon: "lock",
  },
  // 전공별 뱃지
  {
    id: 16,
    code: "CS_MASTER",
    name: "코딩 마스터",
    description: "알고리즘 대회 입상",
    category: "학업",
    tier: "epic",
    scope: "컴퓨터공학과",
    acquired: true,
    progress: 100,
    maxProgress: 1,
    currentValue: 1,
    icon: "lightbulb",
  },
  {
    id: 17,
    code: "DESIGN_MASTER",
    name: "디자인 천재",
    description: "디자인 공모전 입상",
    category: "학업",
    tier: "epic",
    scope: "디자인학과",
    acquired: false,
    progress: 0,
    maxProgress: 1,
    currentValue: 0,
    icon: "award",
  },
  // 리더십
  {
    id: 18,
    code: "LEADER",
    name: "타고난 리더",
    description: "학생회 임원 3회",
    category: "활동",
    tier: "legendary",
    scope: "전체",
    acquired: false,
    progress: 67,
    maxProgress: 3,
    currentValue: 2,
    icon: "users",
  },
  // 체육
  {
    id: 19,
    code: "FITNESS",
    name: "헬창",
    description: "주 3회 이상 체육활동",
    category: "활동",
    tier: "rare",
    scope: "전체",
    acquired: true,
    progress: 100,
    maxProgress: 3,
    currentValue: 4,
    icon: "dumbbell",
  },
  // 어학
  {
    id: 20,
    code: "GLOBAL",
    name: "세계는 내 무대",
    description: "토익 900점 이상",
    category: "학업",
    tier: "legendary",
    scope: "전체",
    acquired: false,
    progress: 98,
    maxProgress: 900,
    currentValue: 880,
    icon: "globe",
  },
];

const tierColors = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 via-orange-500 to-red-500",
  hidden: "from-black via-purple-900 to-black",
};

const tierGlow = {
  common: "shadow-gray-500/50",
  rare: "shadow-blue-500/50",
  epic: "shadow-purple-500/50",
  legendary: "shadow-yellow-500/50",
  hidden: "shadow-purple-900/50",
};

interface StudentViewProps {
  onSwitchToAdmin?: () => void;
}

export function StudentView({ onSwitchToAdmin }: StudentViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [activeTab, setActiveTab] = useState<"badges" | "missions">("badges");
  const [selectedBadge, setSelectedBadge] = useState<StudentBadge | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime > 1000) {
      setLogoClickCount(1);
    } else {
      setLogoClickCount(logoClickCount + 1);
      if (logoClickCount + 1 === 5) {
        onSwitchToAdmin?.();
        setLogoClickCount(0);
      }
    }
    setLastClickTime(now);
  };

  const handleBadgeClick = (badge: StudentBadge) => {
    setSelectedBadge(badge);
    setMousePosition({ x: 0, y: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePosition({ x, y });
  };

  const categories = ["전체", "학업", "활동", "이벤트", "히든"];

  const filteredBadges =
    selectedCategory === "전체"
      ? studentBadges
      : studentBadges.filter((b) => b.category === selectedCategory);

  const totalBadges = studentBadges.length;
  const acquiredBadges = studentBadges.filter((b) => b.acquired).length;
  const progressPercentage = Math.round((acquiredBadges / totalBadges) * 100);

  const CircularProgress = ({ progress, size = 120 }: { progress: number; size?: number }) => {
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(100, 116, 139, 0.2)"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700/20 bg-gradient-to-r from-slate-800 to-slate-700 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleLogoClick}
            title="로고를 5번 연속 클릭하면 관리자 모드로 전환됩니다"
          >
            <img src={studentLogo} alt="JJ STAR" className="h-10" />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white font-medium" style={{ fontSize: '15px', fontWeight: 600 }}>김철수</div>
              <div className="text-white/70" style={{ fontSize: '13px' }}>컴퓨터공학과 2학년</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
              김
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontWeight: 700 }}>JJ STAR 뱃지 시스템</h1>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={() => setActiveTab("badges")}
              className={`px-12 py-6 text-lg font-bold rounded-full transition-all ${activeTab === "badges"
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                }`}
            >
              내 뱃지
            </Button>
            <Button
              onClick={() => setActiveTab("missions")}
              className={`px-12 py-6 text-lg font-bold rounded-full transition-all ${activeTab === "missions"
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                }`}
            >
              뱃지 미션
            </Button>
          </div>
        </div>

        {/* Badges Tab Content */}
        {activeTab === "badges" && (
          <>
            {/* Stats Section */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontWeight: 700 }}>내 뱃지 컬렉션</h2>
                <p className="text-gray-600">수집하고 자랑하세요!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white/60 backdrop-blur-sm border-blue-200 shadow-lg">
                  <div className="p-6 text-center">
                    <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-800 mb-1" style={{ fontWeight: 700 }}>
                      {acquiredBadges}/{totalBadges}
                    </div>
                    <div className="text-gray-600">보유 뱃지</div>
                  </div>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-purple-200 shadow-lg">
                  <div className="p-6 text-center">
                    <Star className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-800 mb-1" style={{ fontWeight: 700 }}>{progressPercentage}%</div>
                    <div className="text-gray-600">컬렉션 완성도</div>
                  </div>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-orange-200 shadow-lg">
                  <div className="p-6 text-center">
                    <Zap className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-800 mb-1" style={{ fontWeight: 700 }}>
                      {studentBadges.filter((b) => b.tier === "legendary" && b.acquired).length}
                    </div>
                    <div className="text-gray-600">전설 등급 보유</div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-6 justify-center flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className={
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg"
                      : "bg-white/60 border-blue-200 text-gray-700 hover:bg-white/80 shadow-md"
                  }
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredBadges.map((badge) => {
                const isLocked = !badge.acquired;
                const isHidden = badge.tier === "hidden" && !badge.acquired;

                return (
                  <div
                    key={badge.id}
                    className={`relative group cursor-pointer transition-all duration-300 ${isLocked ? "opacity-60" : "hover:scale-105"
                      }`}
                    onClick={() => handleBadgeClick(badge)}
                  >
                    <div className="relative">
                      {/* Progress Circle */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CircularProgress progress={badge.acquired ? 100 : badge.progress} />
                      </div>

                      {/* Badge Icon */}
                      {badge.id === 12 ? (
                        // 페스티벌 뱃지 - 배경 없이 이미지만
                        <div className="relative z-10 w-[120px] h-[120px] flex items-center justify-center">
                          <img
                            src={festivalBadge}
                            alt="2025 JJ Festival"
                            className="w-full h-full object-contain drop-shadow-lg"
                          />
                        </div>
                      ) : (
                        // 일반 뱃지 - 원형 배경
                        <div
                          className={`relative z-10 w-[120px] h-[120px] rounded-full bg-gradient-to-br ${isLocked
                            ? "from-gray-400 to-gray-500"
                            : tierColors[badge.tier]
                            } flex items-center justify-center text-white shadow-2xl ${!isLocked && tierGlow[badge.tier]
                            } transition-all duration-300 overflow-hidden`}
                        >
                          {isHidden ? (
                            <Lock className="h-12 w-12 text-white/50" />
                          ) : (
                            <div className={isLocked ? "opacity-40" : ""}>
                              <BadgeIcon icon={badge.icon} />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tier Badge */}
                      {!isLocked && (
                        <div className="absolute -top-2 -right-2 z-20">
                          <Badge
                            className={`bg-gradient-to-r ${tierColors[badge.tier]} text-white px-2 py-1 shadow-lg`}
                            style={{ fontSize: '11px' }}
                          >
                            {badge.tier === "common" && "일반"}
                            {badge.tier === "rare" && "레어"}
                            {badge.tier === "epic" && "에픽"}
                            {badge.tier === "legendary" && "전설"}
                            {badge.tier === "hidden" && "히든"}
                          </Badge>
                        </div>
                      )}

                      {/* Lock Icon */}
                      {isLocked && !isHidden && (
                        <div className="absolute bottom-0 right-0 z-20 bg-gray-800 rounded-full p-2">
                          <Lock className="h-5 w-5 text-white/70" />
                        </div>
                      )}
                    </div>

                    {/* Badge Info */}
                    <div className="mt-3 text-center">
                      <h3
                        className={`font-bold mb-1 ${isLocked ? "text-gray-400" : "text-gray-800"
                          }`}
                        style={{ fontSize: '15px', fontWeight: 600 }}
                      >
                        {isHidden ? "???" : badge.name}
                      </h3>
                      <p
                        className={`text-xs mb-2 ${isLocked ? "text-gray-400" : "text-gray-600"
                          }`}
                        style={{ fontSize: '13px' }}
                      >
                        {isHidden ? "???" : badge.description}
                      </p>
                      {!badge.acquired && !isHidden && (
                        <div className="text-xs text-blue-600 font-medium" style={{ fontSize: '13px' }}>
                          {badge.currentValue}/{badge.maxProgress} ({badge.progress}%)
                        </div>
                      )}
                      {badge.scope !== "전체" && (
                        <Badge variant="outline" className="text-xs mt-1 border-blue-300 text-blue-700 bg-white/40" style={{ fontSize: '12px' }}>
                          {badge.scope}
                        </Badge>
                      )}
                    </div>

                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                      <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-gray-700 whitespace-nowrap">
                        {isHidden ? "히든 뱃지를 발견하세요!" : badge.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hidden Hint */}
            {selectedCategory === "히든" && (
              <div className="mt-12 text-center">
                <div className="inline-block bg-white/60 backdrop-blur-sm border border-purple-300 rounded-lg px-6 py-4 shadow-lg">
                  <div className="flex items-center gap-3 text-purple-700">
                    <Lock className="h-5 w-5" />
                    <span className="font-medium" style={{ fontSize: '14px' }}>
                      히든 뱃지는 특별한 조건으로만 획득할 수 있습니다. 힌트를 찾아보세요!
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Missions Tab Content */}
        {activeTab === "missions" && activeMissions.length > 0 && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontWeight: 700 }}>진행중인 미션</h2>
              <p className="text-gray-500">미션을 완료하고 특별한 보상을 받으세요!</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {activeMissions.map((mission) => {
                const rankings = getMissionRankings(mission.id);
                const progressPercent = Math.round((mission.myProgress / parseFloat(mission.targetValue)) * 100);
                return (
                  <Card key={mission.id} className="bg-white border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow rounded-2xl">
                    <div className="bg-indigo-600 p-4 text-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-white/20 text-white border-0 font-semibold" style={{ fontSize: '12px' }}>
                              {mission.type}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-base mb-1" style={{ fontWeight: 700 }}>{mission.name}</h3>
                          <p className="text-white/90" style={{ fontSize: '14px' }}>{mission.description}</p>
                        </div>
                        <Gift className="h-6 w-6 text-white/80" />
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="relative">
                          <div className="w-full bg-indigo-800/50 rounded-full overflow-hidden" style={{ height: '18px' }}>
                            <div
                              className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ fontSize: '13px' }}>
                              {mission.myProgress} / {mission.targetValue}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-white/80 mt-3" style={{ fontSize: '13px' }}>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(mission.startDate, "MM.dd", { locale: ko })} ~{" "}
                            {format(mission.endDate, "MM.dd", { locale: ko })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      {/* My Rank */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: '14px' }}>
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">
                            전체 {mission.myRank}등 · 학과 {mission.myDepartmentRank}등
                          </span>
                        </div>
                      </div>

                      {/* Reward */}
                      <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <div className="flex items-start gap-2">
                          <Gift className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium text-orange-800 mb-1" style={{ fontSize: '13px' }}>보상</div>
                            <div className="text-gray-700" style={{ fontSize: '15px' }}>{mission.reward}</div>
                          </div>
                        </div>
                      </div>

                      {/* Rankings */}
                      <Tabs defaultValue="overall" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1">
                          <TabsTrigger value="overall" className="data-[state=active]:bg-white" style={{ fontSize: '13px' }}>전체 TOP 5</TabsTrigger>
                          <TabsTrigger value="department" className="data-[state=active]:bg-white" style={{ fontSize: '13px' }}>학과 TOP 5</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overall" className="mt-3 space-y-1.5">
                          {rankings.overall.map((entry) => (
                            <div
                              key={entry.rank}
                              className={`flex items-center justify-between py-2 px-3 rounded-lg ${entry.isMe ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-100"
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-bold min-w-[2rem] ${entry.rank === 1
                                    ? "text-yellow-600"
                                    : entry.rank === 2
                                      ? "text-gray-500"
                                      : entry.rank === 3
                                        ? "text-orange-600"
                                        : "text-gray-400"
                                    }`}
                                  style={{ fontSize: '13px' }}
                                >
                                  {entry.rank}위
                                </span>
                                <div className="flex-1">
                                  <div className={`${entry.isMe ? "font-bold text-blue-700" : "font-medium text-gray-800"}`} style={{ fontSize: '15px' }}>
                                    {entry.studentName}
                                    {entry.isMe && (
                                      <Badge className="ml-1.5 bg-blue-600 text-white px-1.5 py-0" style={{ fontSize: '12px' }}>나</Badge>
                                    )}
                                  </div>
                                  <div className="text-gray-500" style={{ fontSize: '13px' }}>{entry.department}</div>
                                </div>
                              </div>
                              <span className="font-bold text-gray-700" style={{ fontSize: '15px' }}>{entry.progress}</span>
                            </div>
                          ))}
                        </TabsContent>
                        <TabsContent value="department" className="mt-3 space-y-1.5">
                          {rankings.department.map((entry) => (
                            <div
                              key={entry.rank}
                              className={`flex items-center justify-between py-2 px-3 rounded-lg ${entry.isMe ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-100"
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-bold min-w-[2rem] ${entry.rank === 1
                                    ? "text-yellow-600"
                                    : entry.rank === 2
                                      ? "text-gray-500"
                                      : entry.rank === 3
                                        ? "text-orange-600"
                                        : "text-gray-400"
                                    }`}
                                  style={{ fontSize: '13px' }}
                                >
                                  {entry.rank}위
                                </span>
                                <div className="flex-1">
                                  <div className={`${entry.isMe ? "font-bold text-blue-700" : "font-medium text-gray-800"}`} style={{ fontSize: '15px' }}>
                                    {entry.studentName}
                                    {entry.isMe && (
                                      <Badge className="ml-1.5 bg-blue-600 text-white px-1.5 py-0" style={{ fontSize: '12px' }}>나</Badge>
                                    )}
                                  </div>
                                  <div className="text-gray-500" style={{ fontSize: '13px' }}>{entry.department}</div>
                                </div>
                              </div>
                              <span className="font-bold text-gray-700" style={{ fontSize: '15px' }}>{entry.progress}</span>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Badge Detail Dialog */}
      <Dialog open={selectedBadge !== null} onOpenChange={(open) => !open && setSelectedBadge(null)}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-50 to-white">
          {selectedBadge && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl" style={{ fontWeight: 700 }}>
                  {selectedBadge.tier === "hidden" && !selectedBadge.acquired ? "???" : selectedBadge.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Badge Display */}
                <div
                  className="flex justify-center items-center py-8"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
                  style={{ perspective: "1000px" }}
                >
                  {selectedBadge.id === 12 ? (
                    // PNG 이미지 뱃지 (2025 페스티벌)
                    <div
                      className="relative"
                      style={{
                        transform: `rotateY(${mousePosition.x * 20}deg) rotateX(${-mousePosition.y * 20}deg)`,
                        transformStyle: "preserve-3d",
                        transition: "transform 0.1s ease-out",
                      }}
                    >
                      <img
                        src={festivalBadge}
                        alt="2025 JJ Festival"
                        className="w-80 h-80 object-contain drop-shadow-2xl"
                      />
                    </div>
                  ) : (
                    // 기본 원형 뱃지
                    <div
                      className="relative"
                      style={{
                        transform: `rotateY(${mousePosition.x * 20}deg) rotateX(${-mousePosition.y * 20}deg)`,
                        transformStyle: "preserve-3d",
                        transition: "transform 0.1s ease-out",
                      }}
                    >
                      <div
                        className={`w-64 h-64 rounded-full bg-gradient-to-br ${selectedBadge.acquired ? tierColors[selectedBadge.tier] : "from-gray-400 to-gray-600"
                          } flex items-center justify-center text-white shadow-2xl`}
                      >
                        {selectedBadge.tier === "hidden" && !selectedBadge.acquired ? (
                          <Lock className="h-32 w-32 text-white/50" />
                        ) : (
                          <div className={selectedBadge.acquired ? "" : "opacity-40"} style={{ transform: "scale(2.5)" }}>
                            <BadgeIcon icon={selectedBadge.icon} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Badge Info */}
                <div className="space-y-4 px-4">
                  <div className="flex items-center gap-3">
                    <Badge className={`bg-gradient-to-r ${tierColors[selectedBadge.tier]} text-white`}>
                      {selectedBadge.tier === "common" && "일반"}
                      {selectedBadge.tier === "rare" && "레어"}
                      {selectedBadge.tier === "epic" && "에픽"}
                      {selectedBadge.tier === "legendary" && "전설"}
                      {selectedBadge.tier === "hidden" && "히든"}
                    </Badge>
                    <Badge variant="outline">{selectedBadge.category}</Badge>
                    {selectedBadge.scope !== "전체" && (
                      <Badge variant="outline">{selectedBadge.scope}</Badge>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-700 mb-2" style={{ fontSize: "15px" }}>설명</h4>
                    <p className="text-gray-600" style={{ fontSize: "15px" }}>
                      {selectedBadge.tier === "hidden" && !selectedBadge.acquired
                        ? "이 뱃지는 특별한 조건으로만 획득할 수 있습니다."
                        : selectedBadge.description}
                    </p>
                  </div>

                  {!selectedBadge.acquired && selectedBadge.tier !== "hidden" && (
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2" style={{ fontSize: "15px" }}>진행도</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-600" style={{ fontSize: "14px" }}>
                          <span>{selectedBadge.currentValue} / {selectedBadge.maxProgress}</span>
                          <span className="font-bold text-blue-600">{selectedBadge.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${selectedBadge.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedBadge.acquired && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <Trophy className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-bold text-green-800" style={{ fontSize: "15px" }}>획득 완료!</div>
                        <div className="text-green-600 text-sm">이 뱃지를 성공적으로 획득했습니다.</div>
                      </div>
                    </div>
                  )}

                  {selectedBadge.chain && selectedBadge.chain.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2" style={{ fontSize: "15px" }}>다음 단계</h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <ChevronRight className="h-4 w-4" />
                        <span style={{ fontSize: "14px" }}>
                          {studentBadges.find(b => b.id === selectedBadge.chain![0])?.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center text-gray-400 pt-4 border-t" style={{ fontSize: "13px" }}>
                  마우스를 움직여서 뱃지를 3D로 회전해보세요
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
