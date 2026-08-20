"use client";

import { Download, Search, X } from "lucide-react";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { LiaRupeeSignSolid } from "react-icons/lia";
import Button from "../ui/button/Button";
import { DateRangeFilter } from "./DatePicker";
import { DropdownFilter } from "./DropDownFilter";
import { ColumnConfig } from "./ListTable";
import { SearchFilter } from "./searchFilter";

interface IListTableFilters {
  data: any;
  filters:
    | {
        search?: boolean;
        searchPlaceHolder?: string;
        emailSearch?: boolean;
        emailSearchPlaceHolder?: string;
        status?: boolean;
        IPOstatus?: boolean;
        statusCode?: boolean;
        typeDropdown?: boolean;
        date?: boolean;
        dropdown?: {
          key: string;
          label: string;
          options: {
            label: string;
            value: any;
          }[];
        }[];
        budgetRange?: boolean;
        blogStatus?: boolean;
        verifyStatus?: boolean;
        ipoStatus?: boolean;
      }
    | undefined;
  filterParams: {
    [key: string]: any;
    search: string;
    emailSearch: string;
    status: string | null;
    IPOstatus: string | null;
    type: string | null;
    statusCode: number | null;
    startDate: Date | null;
    endDate: Date | null;
    minBudget: number | null;
    maxBudget: number | null;
    pincode: number | null;
  };
  displayFilters: {
    search: string;
    emailSearch: string;
  };
  handleSearchChange: (value: string) => void;
  handleEmailSearchChange: (value: string) => void;
  setFilterParams: Dispatch<
    SetStateAction<{
      [key: string]: any;
      search: string;
      emailSearch: string;
      status: string | null;
      IPOstatus: string | null;
      type: string | null;
      statusCode: number | null;
      startDate: Date | null;
      endDate: Date | null;
      minBudget: number | null;
      maxBudget: number | null;
      pincode: number | null;
    }>
  >;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setDisplayFilters: Dispatch<
    SetStateAction<{
      search: string;
      emailSearch: string;
    }>
  >;
  searchDebounceTimer: RefObject<NodeJS.Timeout | null>;
  emailSearchDebounceTimer: RefObject<NodeJS.Timeout | null>;
  columns: ColumnConfig<any>[];
  selectable: boolean;
  selectedRows: any;
  exportable: boolean;
  setSelectedRows: Dispatch<SetStateAction<any>>;
}

const ListTableFilteres = ({
  filters,
  filterParams,
  displayFilters,
  handleSearchChange,
  handleEmailSearchChange,
  setFilterParams,
  setCurrentPage,
  setDisplayFilters,
  searchDebounceTimer,
  emailSearchDebounceTimer,
  columns,
  data,
  selectable,
  selectedRows,
  exportable,
  setSelectedRows,
}: IListTableFilters) => {
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const [budgetError, setBudgetError] = useState("");

  const handleBudgetFilter = () => {
    setBudgetError("");

    if (!minBudget && !maxBudget) {
      setBudgetError("Enter min or max budget");
      return;
    }

    if (minBudget && maxBudget && Number(minBudget) > Number(maxBudget)) {
      setBudgetError("Min budget cannot be greater than Max budget");
      return;
    }

    setFilterParams((prev: any) => ({
      ...prev,
      minBudget: minBudget ? Number(minBudget) : null,
      maxBudget: maxBudget ? Number(maxBudget) : null,
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setDisplayFilters({
      search: "",
      emailSearch: "",
    });

    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }
    if (emailSearchDebounceTimer.current) {
      clearTimeout(emailSearchDebounceTimer.current);
    }

    setFilterParams({
      search: "",
      emailSearch: "",
      status: null,
      IPOstatus: null,
      type: null,
      startDate: null,
      endDate: null,
      statusCode: null,
      minBudget: null,
      maxBudget: null,
      pincode: null,
      ...(filters?.dropdown
        ? filters?.dropdown?.reduce((acc, curr) => {
            acc[curr?.key] = null;
            return acc;
          }, {} as Record<string, any>)
        : {}),
    });

    setMinBudget("");
    setMaxBudget("");
    setCurrentPage(1);
  };

  const hasFilters = () => {
    const hasDisplayFilters =
      displayFilters.search !== "" || displayFilters.emailSearch !== "";
    const hasOtherFilters = Object.entries(filterParams).some(([key, val]) => {
      if (key === "search" || key === "emailSearch") return false;
      return (
        val !== null &&
        val !== "" &&
        !(val instanceof Date && isNaN(val?.getTime()))
      );
    });
    return hasDisplayFilters || hasOtherFilters;
  };

  const handleExport = () => {
    const headers = columns?.map((col) => col?.header).join(",");
    const rows = data
      .map((row: any) =>
        columns
          ?.map((col) => {
            const value = row[col?.key];
            return `"${(value || "").toString().replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "booking-data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-4">
          {filters?.search && (
            <SearchFilter
              Icon={
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground dark:text-white/50" />
              }
              label="Search"
              value={displayFilters.search}
              onChange={handleSearchChange}
              placeholder={
                filters?.searchPlaceHolder ||
                "Search by location or occasion..."
              }
            />
          )}
          {filters?.emailSearch && (
            <SearchFilter
              Icon={
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground dark:text-white/50" />
              }
              label="Search by email"
              value={displayFilters.emailSearch}
              onChange={handleEmailSearchChange}
              placeholder={
                filters?.emailSearchPlaceHolder || "Search by member email..."
              }
            />
          )}
          {filters?.statusCode && (
            <DropdownFilter
              label="Status code"
              allowCustom={true}
              value={filterParams?.statusCode}
              onChange={(value) => {
                setFilterParams((prev) => ({
                  ...prev,
                  statusCode: value === "null" ? null : value,
                }));
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: null },
                { label: "200", value: 200 },
                { label: "201", value: 201 },
                { label: "400", value: 400 },
                { label: "401", value: 401 },
                { label: "403", value: 403 },
                { label: "404", value: 404 },
                { label: "500", value: 500 },
              ]}
              placeholder="Status Code"
              customPlaceholder="Enter status code..."
            />
          )}
          {filters?.typeDropdown && (
            <DropdownFilter
              label="Role Status"
              value={filterParams?.type}
              onChange={(value) => {
                setFilterParams((prev) => ({
                  ...prev,
                  type: value === "null" ? null : value,
                }));
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: null },
                { label: "Admin", value: "1" },
                { label: "Artist", value: "2" },
              ]}
              placeholder="Type"
            />
          )}
          {filters?.status && (
            <DropdownFilter
              label="Status"
              value={filterParams?.status}
              onChange={(value) => {
                setFilterParams((prev) => ({
                  ...prev,
                  status: value === "null" ? null : value,
                }));
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: null },
                { label: "Active", value: "1" },
                { label: "Inactive", value: "0" },
              ]}
              placeholder="Status"
            />
          )}
          {filters?.IPOstatus && (
            <DropdownFilter
              label="Status"
              value={filterParams?.IPOstatus}
              onChange={(value) => {
                setFilterParams((prev) => ({
                  ...prev,
                  IPOstatus: value,
                }));
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: null },
                { label: "LISTED", value: "1" },
                { label: "ONGOING", value: "2" },
                { label: "UPCOMING", value: "3" },
                { label: "CLOSED", value: "4" },
              ]}
              placeholder="Status"
            />
          )}
          {filters?.blogStatus && (
            <DropdownFilter
              label="Status"
              value={filterParams?.status}
              onChange={(value) => {
                setFilterParams((prev) => ({
                  ...prev,
                  status: value === "null" ? null : value,
                }));
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: null },
                { label: "Draft", value: "0" },
                { label: "Published", value: "1" },
                { label: "Pending", value: "2" },
              ]}
              placeholder="Status"
            />
          )}

          {filters?.verifyStatus && (
            <DropdownFilter
              label="Status"
              value={filterParams?.status}
              onChange={(value) => {
                setFilterParams((prev) => ({
                  ...prev,
                  status: value === "null" ? null : value,
                }));
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: null },
                { label: "Verified", value: "1" },
                { label: "Not Verified", value: "0" },
              ]}
              placeholder="Status"
            />
          )}
          {filters?.date && (
            <DateRangeFilter
              startDate={filterParams?.startDate}
              endDate={filterParams?.endDate}
              onChange={({ startDate, endDate }) => {
                setFilterParams((prev) => ({ ...prev, startDate, endDate }));
                setCurrentPage(1);
              }}
            />
          )}
          {filters?.dropdown?.map((dropdown) => (
            <DropdownFilter
              label={dropdown?.label}
              key={dropdown?.key}
              value={filterParams[dropdown?.key]}
              onChange={(value) => {
                setFilterParams((prev) => ({
                  ...prev,
                  [dropdown?.key]: value === "null" ? null : value,
                }));
                setCurrentPage(1);
              }}
              options={dropdown?.options}
              placeholder={dropdown?.label}
            />
          ))}
          {filters?.budgetRange && (
            <div className="relative flex items-end gap-2 justify-center">
              <div className="relative">
                <SearchFilter
                  Icon={
                    <LiaRupeeSignSolid className="absolute left-3 h-4 w-4 text-muted-foreground dark:text-white/50" />
                  }
                  label="Minimum Budget "
                  placeholder="Min Budget"
                  value={minBudget}
                  onChange={setMinBudget}
                />
              </div>
              <div className="relative">
                <SearchFilter
                  Icon={
                    <LiaRupeeSignSolid className="absolute left-3 h-4 w-4 text-muted-foreground dark:text-white/50" />
                  }
                  label="Maximum Budget "
                  placeholder="Max Budget"
                  value={maxBudget}
                  onChange={setMaxBudget}
                />
              </div>
              <Button
                onClick={handleBudgetFilter}
                size="sm"
                className="w-20 h-9.5"
                disabled={!maxBudget && !minBudget}
              >
                Apply
              </Button>
              {budgetError && (
                <span className="absolute -bottom-5 left-0 text-xs text-red-500">
                  {budgetError}
                </span>
              )}
            </div>
          )}
          <div className="flex justify-between items-center p-3 ml-auto gap-3">
            {hasFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="ml-auto dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white/50"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}

            {(selectable || exportable) && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {selectable && selectedRows.length > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedRows.length} selected
                    </div>
                  )}
                  {exportable && (
                    <Button size="sm" onClick={handleExport}>
                      <Download className="mr-2 h-4 w-4" />
                      Export to CSV
                    </Button>
                  )}
                </div>
                {selectable && selectedRows.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRows([])}
                    >
                      Clear Selection
                    </Button>
                    <Button variant="outline" size="sm">
                      Delete Selected
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListTableFilteres;
