import {
  Lock,
  LogOut,
  Power,
  Settings,
  User,
  Search,
  Menu,
  Globe,
  FileText,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  onSwitchToStudent?: () => void;
}

export function AdminHeader({
  onMenuToggle,
  onSwitchToStudent,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="메뉴/태그로 검색하세요"
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onSwitchToStudent}>
            <Globe className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <FileText className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Lock className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Power className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>진</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">
                    진돗개
                  </span>
                  <span className="text-xs text-muted-foreground">
                    빅데이터센터
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                프로필
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                설정
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}