import { useState } from "react";
import { FileSpreadsheet, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import * as XLSX from "xlsx";

interface BadgeCriteria {
  id: number;
  category: string;
  criterion: string;
  linkedData: string;
  dataProcessingMethod: string;
  notes: string;
}

const badgeCriteriaData: BadgeCriteria[] = [
  // 학생활동
  {
    id: 1,
    category: "학생활동",
    criterion: "상담 참여 횟수",
    linkedData: "상담 주제별 횟수",
    dataProcessingMethod: "",
    notes: "",
  },
  // 대학생활
  {
    id: 2,
    category: "대학생활",
    criterion: "정규학기 등록 횟수",
    linkedData: "연속 등록 횟수",
    dataProcessingMethod: "시스템 자동",
    notes: "",
  },
  {
    id: 3,
    category: "대학생활",
    criterion: "계절학기 등록 횟수",
    linkedData: "누적 등록 횟수",
    dataProcessingMethod: "시스템 자동",
    notes: "",
  },
  {
    id: 4,
    category: "대학생활",
    criterion: "방학 간 교내 캠프 참여",
    linkedData: "",
    dataProcessingMethod: "시스템 자동",
    notes: "",
  },
  {
    id: 5,
    category: "대학생활",
    criterion: "교외 캠프 참여",
    linkedData: "",
    dataProcessingMethod:
      "교내 연계의 경우 자동, 그 외엔 별도 확인 필요",
    notes: "취득 인증 서면확인 별도 필요",
  },
  {
    id: 6,
    category: "대학생활",
    criterion: "공모전 참여",
    linkedData: "",
    dataProcessingMethod:
      "교내 연계의 경우 자동, 그 외엔 별도 확인 필요",
    notes: "취득 인증 서면확인 별도 필요",
  },
  // 취업
  {
    id: 7,
    category: "취업",
    criterion: "자격증 코스 참여 (비교과)",
    linkedData: "",
    dataProcessingMethod: "시스템 자동",
    notes:
      "단순참여만 체크할것인지 만족도조사 참여자만 체크할 것인지 결정",
  },
  {
    id: 8,
    category: "취업",
    criterion: "자격증 취득",
    linkedData: "",
    dataProcessingMethod: "별도 확인 필요",
    notes: "취득 인증 서면확인 별도 필요",
  },
  {
    id: 9,
    category: "취업",
    criterion: "현장실습 참여",
    linkedData: "",
    dataProcessingMethod: "시스템 자동",
    notes: "",
  },
  {
    id: 10,
    category: "취업",
    criterion: "해외봉사 참여",
    linkedData: "",
    dataProcessingMethod: "시스템 자동",
    notes: "",
  },
  {
    id: 11,
    category: "취업",
    criterion: "인턴십 프로그램 참여",
    linkedData: "",
    dataProcessingMethod: "",
    notes: "",
  },
  {
    id: 12,
    category: "취업",
    criterion: "취업 프로그램 참여",
    linkedData: "",
    dataProcessingMethod: "",
    notes: "",
  },
  // 전공
  {
    id: 13,
    category: "전공",
    criterion: "",
    linkedData: "",
    dataProcessingMethod: "",
    notes: "",
  },
];

export function StudentListManagement() {
  const [criteriaData, setCriteriaData] = useState<
    BadgeCriteria[]
  >(badgeCriteriaData);
  const [editingId, setEditingId] = useState<number | null>(
    null,
  );
  const [editValues, setEditValues] = useState<
    Partial<BadgeCriteria>
  >({});

  const handleAddRow = (category: string) => {
    const newId =
      Math.max(...criteriaData.map((item) => item.id)) + 1;
    const newRow: BadgeCriteria = {
      id: newId,
      category: category,
      criterion: "",
      linkedData: "",
      dataProcessingMethod: "",
      notes: "",
    };
    setCriteriaData([...criteriaData, newRow]);
    toast.success("새 행이 추가되었습니다.");
  };

  const handleDeleteRow = (id: number) => {
    setCriteriaData(
      criteriaData.filter((item) => item.id !== id),
    );
    toast.success("행이 삭제되었습니다.");
  };

  const handleEditRow = (id: number) => {
    const item = criteriaData.find((item) => item.id === id);
    if (item) {
      setEditingId(id);
      setEditValues(item);
    }
  };

  const handleSaveRow = (id: number) => {
    setCriteriaData(
      criteriaData.map((item) =>
        item.id === id ? { ...item, ...editValues } : item,
      ),
    );
    setEditingId(null);
    setEditValues({});
    toast.success("변경사항이 저장되었습니다.");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleExcelDownload = () => {
    // 엑셀로 내보낼 데이터 준비
    const excelData = criteriaData.map((item) => ({
      기준_항목: item.criterion,
      연계_데이터: item.linkedData,
      데이터_확인_및_처리_방법: item.dataProcessingMethod,
      주의사항: item.notes,
      카테고리: item.category,
    }));

    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // 컬럼 너비 설정
    worksheet["!cols"] = [
      { wch: 25 }, // 기준 항목
      { wch: 20 }, // 연계 데이터
      { wch: 40 }, // 데이터 확인 및 처리 방법
      { wch: 40 }, // 주의사항
      { wch: 12 }, // 카테고리
    ];

    // 워크북 생성
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "뱃지 발급 요건",
    );

    // 파일명 생성 (현재 날짜 포함)
    const today = new Date().toISOString().split("T")[0];
    const fileName = `뱃지시스템_뱃지발급가능요건_${today}.xlsx`;

    // 엑셀 파일 다운로드
    XLSX.writeFile(workbook, fileName);
  };

  // 카테고리별로 데이터 그룹화
  const groupedData = criteriaData.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, BadgeCriteria[]>,
  );

  const categories = ["학생활동", "대학생활", "취업", "전공"];

  return (
    <>
      <Toaster />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            뱃지시스템 뱃지 발급 가능 요건
          </h2>
          <Button
            onClick={handleExcelDownload}
            className="gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            엑셀 다운로드
          </Button>
        </div>

        {/* 테이블 */}
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-yellow-100">
                    <TableHead className="border font-bold text-center">
                      기준 항목
                    </TableHead>
                    <TableHead className="border font-bold text-center">
                      연계 데이터
                    </TableHead>
                    <TableHead className="border font-bold text-center">
                      데이터 확인 및 처리 방법
                    </TableHead>
                    <TableHead className="border font-bold text-center">
                      주의사항
                    </TableHead>
                    <TableHead className="border font-bold text-center w-[100px]">
                      작업
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <>
                      <TableRow key={`header-${category}`}>
                        <TableCell
                          colSpan={4}
                          className="bg-[#1e3a5f] text-white font-bold text-center py-2 border"
                        >
                          {category}
                        </TableCell>
                        <TableCell className="bg-[#1e3a5f] border text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={() =>
                              handleAddRow(category)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      {groupedData[category]?.map((item) => (
                        <TableRow key={item.id}>
                          {editingId === item.id ? (
                            <>
                              <TableCell className="border p-2">
                                <Input
                                  value={
                                    editValues.criterion || ""
                                  }
                                  onChange={(e) =>
                                    setEditValues({
                                      ...editValues,
                                      criterion: e.target.value,
                                    })
                                  }
                                  className="h-8"
                                />
                              </TableCell>
                              <TableCell className="border p-2">
                                <Input
                                  value={
                                    editValues.linkedData || ""
                                  }
                                  onChange={(e) =>
                                    setEditValues({
                                      ...editValues,
                                      linkedData:
                                        e.target.value,
                                    })
                                  }
                                  className="h-8"
                                />
                              </TableCell>
                              <TableCell className="border p-2">
                                <Input
                                  value={
                                    editValues.dataProcessingMethod ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    setEditValues({
                                      ...editValues,
                                      dataProcessingMethod:
                                        e.target.value,
                                    })
                                  }
                                  className="h-8"
                                />
                              </TableCell>
                              <TableCell className="border p-2">
                                <Input
                                  value={editValues.notes || ""}
                                  onChange={(e) =>
                                    setEditValues({
                                      ...editValues,
                                      notes: e.target.value,
                                    })
                                  }
                                  className="h-8"
                                />
                              </TableCell>
                              <TableCell className="border text-center">
                                <div className="flex gap-1 justify-center">
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() =>
                                      handleSaveRow(item.id)
                                    }
                                    className="h-7 px-2"
                                  >
                                    저장
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                    className="h-7 px-2"
                                  >
                                    취소
                                  </Button>
                                </div>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell
                                className="border cursor-pointer hover:bg-gray-50"
                                onClick={() =>
                                  handleEditRow(item.id)
                                }
                              >
                                {item.criterion}
                              </TableCell>
                              <TableCell
                                className="border cursor-pointer hover:bg-gray-50"
                                onClick={() =>
                                  handleEditRow(item.id)
                                }
                              >
                                {item.linkedData}
                              </TableCell>
                              <TableCell
                                className="border cursor-pointer hover:bg-gray-50"
                                onClick={() =>
                                  handleEditRow(item.id)
                                }
                              >
                                {item.dataProcessingMethod}
                              </TableCell>
                              <TableCell
                                className={`border cursor-pointer hover:bg-gray-50 ${
                                  item.notes.includes(
                                    "본도 필요",
                                  )
                                    ? "text-orange-600"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleEditRow(item.id)
                                }
                              >
                                {item.notes}
                              </TableCell>
                              <TableCell className="border text-center">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleDeleteRow(item.id)
                                  }
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}