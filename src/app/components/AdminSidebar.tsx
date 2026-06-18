import { useState } from "react";
import {
  ChevronRight,
  Star,
  Users,
  Award,
  BookOpen,
  Home,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import logo from "../../images/jj_instar_logo_h64_jj.png";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "my-menu",
    label: "MY MENU",
    icon: <Star className="h-4 w-4" />,
    children: [
      {
        id: "student-list",
        label: "뱃지 발급 요건",
        icon: null,
      },
    ],
  },
  {
    id: "participation",
    label: "참관예약",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "academic",
    label: "학생성공",
    icon: <BookOpen className="h-4 w-4" />,
    children: [
      {
        id: "jjcs-management",
        label: "JJCS기준관리",
        icon: null,
      },
      {
        id: "scholarship-management",
        label: "선도학생 관리",
        icon: null,
      },
      {
        id: "badge-system",
        label: "뱃지 시스템",
        icon: null,
        children: [
          {
            id: "badge-imagelist",
            label: "뱃지 목록",
            icon: null,
          },
          {
            id: "badge-acquisition",
            label: "뱃지 획득 현황",
            icon: null,
          },
          {
            id: "badge-management",
            label: "뱃지 관리",
            icon: null,
          },
          {
            id: "badge-registration",
            label: "뱃지 등록 / 승인",
            icon: null,
          },
          {
            id: "badge-mission",
            label: "뱃지 미션",
            icon: null,
          },
          {
            id: "badge-activity-log",
            label: "뱃지 발급&회수 로그",
            icon: null,
          },
          {
            id: "permission-management",
            label: "권한 관리",
            icon: null,
          },
        ],
      },
    ],
  },
];

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (pageId: string) => void;
}

export function AdminSidebar({
  currentPage,
  onNavigate,
}: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "academic",
    "badge-system",
  ]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const renderMenuItem = (
    item: MenuItem,
    depth: number = 0,
  ) => {
    const hasChildren =
      item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = currentPage === item.id;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else {
              onNavigate(item.id);
              setIsMobileOpen(false);
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-${depth === 0 ? "3" : "2"} rounded hover:bg-white/10 transition-colors ${isActive
              ? depth === 0
                ? "bg-white/10"
                : "bg-[#3b82f6] text-white"
              : ""
            }`}
          style={{ paddingLeft: `${1 + depth * 1.5}rem` }}
        >
          <div className="flex items-center gap-2">
            {item.icon}
            <span
              className={depth === 0 ? "text-sm" : "text-sm"}
            >
              {item.label}
            </span>
          </div>
          {hasChildren && (
            <ChevronRight
              className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""
                }`}
            />
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) =>
              renderMenuItem(child, depth + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1e3a5f] text-white">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt="전주대학교 JUIS"
            className="h-12 object-contain"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      <aside className="hidden md:block w-64 border-r bg-[#1e3a5f] text-white h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {isMobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-0 bottom-0 w-64 z-50 shadow-lg">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}