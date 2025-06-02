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
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/ui/components/ui/context-menu";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/ui/components/ui/tooltip";

import { LDPlayerType } from "@/ui/types/types";
import { Button } from "@/ui/components/ui/button";

export default function Page() {
  const [ldplayers, setLDPlayers] = useState<LDPlayerType[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  const fetchLDPlayers = async () => {
    const data = await window.electron.getLDPlayersDB();

    setLDPlayers((prev) => {
      const oldJson = JSON.stringify(prev);
      const newJson = JSON.stringify(data);
      return oldJson === newJson ? prev : data;
    });
  };

  const handleOpenLDPlayer = async () => {
    const namesToOpen = Array.from(selectedRows);

    try {
      await Promise.all(
        namesToOpen.map((ldName) => window.electron.callLdInstance(ldName)),
      );
    } catch (err) {
      console.error("Open LDPlayer Fail:", err);
    }
  };

  const handleGetToken = async () => {
    const namesToOpen = Array.from(selectedRows);

    try {
      await Promise.all(
        namesToOpen.map((ldName) => window.electron.pullDBLdInstance(ldName)),
      );
    } catch (err) {
      console.error("Get Token Fail:", err);
    }
  };

  const handleGetToken2 = async () => {
    const namesToOpen = Array.from(selectedRows);

    try {
      await Promise.all(
        namesToOpen.map((ldName) => window.electron.pullDBLdInstance2(ldName)),
      );
    } catch (err) {
      console.error("Get Token Fail:", err);
    }
  };

  const handleDeleteLDPlayer = async () => {
    const namesToOpen = Array.from(selectedRows);

    try {
      await Promise.all(
        namesToOpen.map((ldName) => window.electron.deleteLdInstance(ldName)),
      );
    } catch (err) {
      console.error("Delete LDPlayer Fail:", err);
    }
  };

  const handleDeleteRow = async () => {
    const namesToOpen = Array.from(selectedRows);

    try {
      await Promise.all(
        namesToOpen.map((ldName) => window.electron.deleteRowFromDB(ldName)),
      );

      await fetchLDPlayers();

      setSelectedRows((prev) => {
        const updated = new Set(prev);
        namesToOpen.forEach((name) => updated.delete(name));
        return updated;
      });
    } catch (err) {
      console.error("Delete Row Database Fail:", err);
    }
  };

  useEffect(() => {
    fetchLDPlayers();
  }, []);

  const handlefetchLdInstance = async () => {
    try {
      const result = await window.electron.fetchLdInstance();
      console.log("LDPlayer :", result);
    } catch (err) {
      console.error("Put LDPlayer Fail:", err);
    }
  };

  return (
    <div>
      <div>
        <Button onClick={handlefetchLdInstance}>ดึง LDPlayer</Button>
      </div>
      <div onMouseLeave={() => setIsSelecting(false)} className="select-none">
        <Table className="[&_*]:text-center [&_*]:align-middle">
          <TableHeader>
            <TableRow>
              <TableHead>ลำดับ</TableHead>
              <TableHead>LDPlayer</TableHead>
              <TableHead>สถานะบัญชีไลน์</TableHead>
              <TableHead>ทำงานครั้งล่าสุด</TableHead>
              <TableHead>สถานะการทำงาน</TableHead>
              <TableHead>ชื่อไลน์</TableHead>
              <TableHead>จำนวนเพื่อน</TableHead>
              <TableHead>จำนวนกลุ่ม</TableHead>
              <TableHead>เบอร์ไลน์</TableHead>
              <TableHead>Token</TableHead>
              <TableHead>วันที่สมัครไลน์</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ldplayers.map((item, index) => (
              <ContextMenu key={item.LDPlayerGridLD}>
                <ContextMenuTrigger asChild>
                  <TableRow
                    key={item.LDPlayerGridLD}
                    onMouseDown={(e) => {
                      if (e.button !== 0) return;

                      setIsSelecting(true);
                      setStartIndex(index);

                      if (e.shiftKey && lastClickedIndex !== null) {
                        const min = Math.min(lastClickedIndex, index);
                        const max = Math.max(lastClickedIndex, index);
                        const newSet = new Set(selectedRows);
                        for (let i = min; i <= max; i++) {
                          newSet.add(ldplayers[i].LDPlayerGridLD);
                        }
                        setSelectedRows(newSet);
                      } else if (e.ctrlKey) {
                        setSelectedRows((prev) => {
                          const newSet = new Set(prev);
                          if (newSet.has(item.LDPlayerGridLD)) {
                            newSet.delete(item.LDPlayerGridLD);
                          } else {
                            newSet.add(item.LDPlayerGridLD);
                          }
                          return newSet;
                        });
                        setLastClickedIndex(index);
                      } else {
                        setSelectedRows(new Set([item.LDPlayerGridLD]));
                        setLastClickedIndex(index);
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelecting || startIndex === null) return;

                      const min = Math.min(startIndex, index);
                      const max = Math.max(startIndex, index);

                      const newSet = new Set(selectedRows);

                      if (!e.ctrlKey) {
                        newSet.clear();
                      }

                      for (let i = min; i <= max; i++) {
                        newSet.add(ldplayers[i].LDPlayerGridLD);
                      }

                      setSelectedRows(newSet);
                    }}
                    onMouseUp={() => {
                      setIsSelecting(false);
                      setStartIndex(null);
                    }}
                    className={`select-none ${
                      selectedRows.has(item.LDPlayerGridLD)
                        ? "bg-blue-100 dark:bg-blue-900"
                        : ""
                    }`}
                  >
                    <TableCell>{item.NoDataGridLD}</TableCell>
                    <TableCell>{item.LDPlayerGridLD}</TableCell>
                    <TableCell>{item.StatusAccGridLD}</TableCell>
                    <TableCell>{item.DateTimeGridLD}</TableCell>
                    <TableCell>{item.StatusGridLD}</TableCell>
                    <TableCell>{item.NameLineGridLD}</TableCell>
                    <TableCell>{item.FriendGridLD}</TableCell>
                    <TableCell>{item.GroupGridLD}</TableCell>
                    <TableCell>{item.PhoneGridLD}</TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            {item.TokenGridLD
                              ? `${item.TokenGridLD.slice(0, 33)}`
                              : ""}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-full break-all whitespace-pre-wrap">
                            {item.TokenGridLD}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{item.CreateAt}</TableCell>
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>ฟังชั่น</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      <ContextMenuItem inset>ตรวจสอบบัญชีไลน์</ContextMenuItem>
                      <ContextMenuItem inset onClick={handleGetToken}>
                        เช็คเบอร์เก็บ Token Auto
                      </ContextMenuItem>
                      <ContextMenuItem inset onClick={handleGetToken2}>
                        เช็คเบอร์เก็บ Token ด่วน
                      </ContextMenuItem>
                      <ContextMenuItem inset>ส่งข้อควา่ม</ContextMenuItem>
                      <ContextMenuItem inset>เพิ่มเพื่อน</ContextMenuItem>
                      <ContextMenuItem inset>สร้างกลุ่ม</ContextMenuItem>
                      <ContextMenuItem inset>เปลี่ยนไฟล์ Data</ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>เปลี่ยนสถานะ</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      <ContextMenuItem inset>ส่งข้อควา่ม</ContextMenuItem>
                      <ContextMenuItem inset>เพิ่มเพื่อน</ContextMenuItem>
                      <ContextMenuItem inset>สร้างกลุ่ม</ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>LDPlayer Mode</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      <ContextMenuItem onClick={handleOpenLDPlayer}>
                        เปิด LDPlayer
                      </ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>Delete Mode</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      <ContextMenuItem onClick={handleDeleteLDPlayer}>
                        ลบ LDPlayer
                      </ContextMenuItem>
                      <ContextMenuItem onClick={handleDeleteRow}>
                        ลบแถว
                      </ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
