import { Award, Calendar, Target, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { PageBreadcrumb } from "./PageBreadcrumb";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, RefreshCw } from "lucide-react";

interface BadgeData {
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
}

interface BadgeImageListProps {
  badges: BadgeData[];
}

export function BadgeImageList({ badges }: BadgeImageListProps) {
  // 이미지가 있고 사용중인 뱃지만 필터링
  const activeBadges = badges.filter(
    (badge) => badge.imageFile && badge.isActive
  );

  return (
    <div className="space-y-0">
      <PageBreadcrumb
        title="뱃지 목록"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "학생성공", href: "#" },
          { label: "뱃지 관리", href: "#" },
          { label: "뱃지 목록" },
        ]}
        pageCode="NONMAJOR_BDG0101"
        actions={
          <>
            <div className="flex items-center gap-2">
              <Input
                placeholder="뱃지 검색..."
                className="w-64"
              />
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

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">활성 뱃지 목록</h2>
          <p className="text-muted-foreground">
            현재 획득 가능한 뱃지 {activeBadges.length}개
          </p>
        </div>

        {activeBadges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Award className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">등록된 뱃지가 없습니다</h3>
            <p className="text-muted-foreground">
              뱃지 관리에서 이미지와 함께 뱃지를 등록해주세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {activeBadges.map((badge) => {
              const isEventBadge = badge.category === "이벤트";
              return (
                <Card
                  key={badge.id}
                  className={`hover:shadow-lg transition-shadow cursor-pointer group ${
                    isEventBadge ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200" : ""
                  }`}
                >
                  <CardHeader className="text-center pb-3">
                    <div className="flex justify-center mb-3">
                      <div className="relative">
                        <div
                          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                            isEventBadge
                              ? "bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500"
                              : "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600"
                          }`}
                        >
                          <Award className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1">
                          <Badge
                            variant="secondary"
                            className={`text-white text-xs px-1.5 py-0.5 ${
                              isEventBadge ? "bg-purple-600" : "bg-blue-600"
                            }`}
                          >
                            {badge.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  <CardTitle className="text-sm">{badge.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {badge.code}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <p className="text-xs text-center text-muted-foreground line-clamp-2">
                    {badge.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Target className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 truncate">
                        <span className="font-medium">{badge.analysisType}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <User className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <div className="flex-1 truncate">
                        <span className="font-medium">{badge.academicStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <div className="text-xs font-bold text-blue-600">
                        {badge.criteriaValue}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
