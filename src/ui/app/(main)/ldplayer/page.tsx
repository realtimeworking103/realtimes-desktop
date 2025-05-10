"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/ui/components/ui/context-menu";
import { Button } from "@/ui/components/ui/button";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/ui/components/ui/tooltip";

import { Checkbox } from "@/ui/components/ui/checkbox";

import { LDPlayerType } from "@/ui/types/types";

export default function Page() {
  const [ldplayers, setLDPlayers] = useState<LDPlayerType[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const allIds = ldplayers.map((ld) => Number(ld.NoDataGridLD));
  const areAllSelected = selectedRows.size === allIds.length;
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const [dragSelectMode, setDragSelectMode] = useState<
    "select" | "deselect" | null
  >(null);

  const selectRow = (id: number) => {
    setSelectedRows((prev) => new Set(prev).add(id));
  };

  const deselectRow = (id: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleRow = (id: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (areAllSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(allIds));
    }
  };

  const isRowSelected = (id: number) => selectedRows.has(id);

  const fetchLDPlayers = async () => {
    const data = await window.electron.getLDPlayersDB();
    setLDPlayers(data);
  };

  useEffect(() => {
    fetchLDPlayers();
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStartIndex(null);
      setDragSelectMode(null);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleOpenLDPlayer = async (ldName: string) => {
    try {
      await window.electron.callLdInstance(ldName);
    } catch (err) {
      console.error("เปิดไม่สำเร็จ:", err);
    }
  };

  const handleDeleteLDPlayer = async (ldName: string) => {
    await window.electron.deleteLdInstance(ldName);
  };

  const handleDeleteRow = async (id: number) => {
    await window.electron.deleteRowFromDB(id);
  };

  const handleGetToken = async (ldName: string) => {
    try {
      await window.electron.pullDBLdInstance(ldName);
    } catch (err) {
      console.error("Pull ไม่สำเร็จ:", err);
    }
  };

  const handlefetchLdInstance = async () => {
    try {
      const result = await window.electron.fetchLdInstance();
      console.log("LDPlayer ที่ดึงมา:", result);
      // fetchLDPlayers();
    } catch (err) {
      console.error("ดึง LDPlayer จากเครื่องไม่สำเร็จ:", err);
    }
  };

  const handleMultiGetToken = async () => {
    for (const id of selectedRows) {
      const row = ldplayers.find((r) => Number(r.NoDataGridLD) === id);
      if (row) await handleGetToken(row.LDPlayerGridLD);
    }
  };

  const handleMultiOpenLDPlayer = async () => {
    for (const id of selectedRows) {
      const row = ldplayers.find((r) => Number(r.NoDataGridLD) === id);
      if (row) await handleOpenLDPlayer(row.LDPlayerGridLD);
    }
  };

  const handleMultiDeleteRow = async () => {
    for (const id of selectedRows) {
      await handleDeleteRow(id);
    }
  };

  const handleMultiDeleteLDPlayer = async () => {
    for (const id of selectedRows) {
      const row = ldplayers.find((r) => Number(r.NoDataGridLD) === id);
      if (row) await handleDeleteLDPlayer(row.LDPlayerGridLD);
    }
  };

  return (
    <div className="w-full space-y-6 p-4">
      <div>
        <Button onClick={handlefetchLdInstance}>ดึง LDPlayer</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] text-center">
              <Checkbox
                checked={areAllSelected}
                onCheckedChange={toggleSelectAll}
                aria-label="เลือกทั้งหมด"
              />
            </TableHead>
            <TableHead className="w-[300px] text-center">ลำดับ</TableHead>
            <TableHead className="w-[300px] text-center">LDPlayer</TableHead>
            <TableHead className="w-[300px] text-center">
              สถานะบัญชีไลน์
            </TableHead>
            <TableHead className="w-[300px] text-center">
              ทำงานครั้งล่าสุด
            </TableHead>
            <TableHead className="w-[300px] text-center">
              สถานะการทำงาน
            </TableHead>
            <TableHead className="w-[300px] text-center">ชื่อไลน์</TableHead>
            <TableHead className="w-[300px] text-center">จำนวนเพื่อน</TableHead>
            <TableHead className="w-[300px] text-center">จำนวนกลุ่ม</TableHead>
            <TableHead className="w-[300px] text-center">เบอร์ไลน์</TableHead>
            <TableHead className="w-[300px] text-center">Token</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center">
          {ldplayers.map((ld, index) => {
            const id = Number(ld.NoDataGridLD);
            const isMultipleSelected =
              selectedRows.size > 1 && isRowSelected(id);
            return (
              <ContextMenu key={ld.NoDataGridLD}>
                <ContextMenuTrigger asChild>
                  <TableRow
                    className="select-none"
                    onMouseDown={(event) => {
                      if (event.button !== 0) return;

                      const selected = isRowSelected(id);
                      setIsDragging(true);
                      setDragStartIndex(index);
                      setDragSelectMode(selected ? "deselect" : "select");
                      toggleRow(id);
                    }}
                    onMouseEnter={() => {
                      if (isDragging && dragSelectMode !== null) {
                        const shouldBeSelected = dragSelectMode === "select";
                        const currentlySelected = isRowSelected(id);
                        if (shouldBeSelected && !currentlySelected) {
                          selectRow(id);
                        } else if (!shouldBeSelected && currentlySelected) {
                          deselectRow(id);
                        }
                      }
                    }}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isRowSelected(id)}
                        onCheckedChange={() => toggleRow(id)}
                      />
                    </TableCell>
                    <TableCell>{ld.NoDataGridLD}</TableCell>
                    <TableCell>{ld.LDPlayerGridLD}</TableCell>
                    <TableCell>{ld.StatusAccGridLD}</TableCell>
                    <TableCell>{ld.DateTimeGridLD}</TableCell>
                    <TableCell>{ld.StatusGridLD}</TableCell>
                    <TableCell>{ld.NameLineGridLD}</TableCell>
                    <TableCell>{ld.FriendGridLD}</TableCell>
                    <TableCell>{ld.GroupGridLD}</TableCell>
                    <TableCell>{ld.PhoneGridLD}</TableCell>
                    <TableCell className="max-w-[100px] truncate">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer">
                            {ld.TokenGridLD
                              ? `${ld.TokenGridLD.slice(0, 20)}...${ld.TokenGridLD.slice(-8)}`
                              : ""}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-[300px] break-all whitespace-pre-wrap">
                            {ld.TokenGridLD ?? "ไม่มีข้อมูล"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger inset>ฟังชั่น</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      <ContextMenuItem
                        onClick={() =>
                          isMultipleSelected
                            ? handleMultiGetToken()
                            : handleGetToken(ld.LDPlayerGridLD)
                        }
                      >
                        เก็บ Token
                      </ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger inset>
                      LDPlayer
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      <ContextMenuItem
                        onClick={() =>
                          isMultipleSelected
                            ? handleMultiOpenLDPlayer()
                            : handleOpenLDPlayer(ld.LDPlayerGridLD)
                        }
                      >
                        เปิด LDPlayer
                      </ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger inset>Delete</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      <ContextMenuItem
                        onClick={() =>
                          isMultipleSelected
                            ? handleMultiDeleteLDPlayer()
                            : handleDeleteLDPlayer(ld.LDPlayerGridLD)
                        }
                      >
                        ลบ LDPlayer
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() =>
                          isMultipleSelected
                            ? handleMultiDeleteRow()
                            : handleDeleteRow(Number(ld.NoDataGridLD))
                        }
                      >
                        ลบแถว
                      </ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
