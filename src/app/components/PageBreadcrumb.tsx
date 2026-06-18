import { ChevronRight, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

interface PageBreadcrumbProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  pageCode?: string;
  onClose?: () => void;
  actions?: React.ReactNode;
}

export function PageBreadcrumb({
  title,
  breadcrumbs,
  pageCode,
  onClose,
  actions,
}: PageBreadcrumbProps) {
  return (
    <div className="border-b bg-white">
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-yellow-400 text-black px-4 py-1 rounded flex items-center gap-2">
            <span className="text-sm font-medium">{title}</span>
            {onClose && (
              <button onClick={onClose} className="hover:bg-yellow-500 rounded p-0.5">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                  )}
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="flex items-center gap-2">
                        {crumb.label}
                        {pageCode && (
                          <span className="text-blue-600">({pageCode})</span>
                        )}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href || "#"}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
