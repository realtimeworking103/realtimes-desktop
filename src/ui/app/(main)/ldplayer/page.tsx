import { useEffect, useState } from "react";

import { Button } from "@/ui/components/ui/button";

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/ui/select";

import { LDPlayerType } from "@/ui/types/types";
import { useLDPlayerActions } from "@/ui/hooks/use-LDPlayerActions";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@radix-ui/react-label";

export default function Page() {
  const [ldplayers, setLDPlayers] = useState<LDPlayerType[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  const [files, setFiles] = useState<{ name: string; count: number }[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [friendCount, setFriendCount] = useState("");

  const [accounts, setAccounts] = useState<LineAccount[]>([]);
  const [selectedOa, setSelectedOa] = useState("");
  const [selectedPrivate, setSelectedPrivate] = useState("");
  const [isDialogOpenCreateGroup, setDialogOpenCreateGroup] = useState(false);

  const oaAccounts = accounts.filter((a) => a.type === "Oa");
  const privateAccounts = accounts.filter((a) => a.type === "Private");

  const fetchLDPlayers = async () => {
    const data = await window.electron.getLDPlayersDB();

    setLDPlayers((prev) => {
      const oldJson = JSON.stringify(prev);
      const newJson = JSON.stringify(data);
      return oldJson === newJson ? prev : data;
    });
  };

  const {
    handleOpenLDPlayer,
    handleDeleteLDPlayer,
    handleDeleteRow,
    handleGetTokenAuto,
    handleCheckban,
    handleSelectFile,
  } = useLDPlayerActions(
    selectedRows,
    ldplayers,
    fetchLDPlayers,
    setSelectedRows,
  );

  const handlefetchLdInstance = async () => {
    try {
      const result = await window.electron.fetchLdInstance();
      console.log("LDPlayer :", result);
    } catch (err) {
      console.error("Put LDPlayer Fail:", err);
    }
  };

  const handleAddFriends = async () => {
    const target = parseInt(friendCount);
    if (isNaN(target) || target <= 0) {
      alert("กรุณากรอกจำนวนเพื่อนที่ต้องการเพิ่มให้ถูกต้อง");
      return;
    }

    const toAdd = ldplayers
      .filter((p) => selectedRows.has(p.LDPlayerGridLD))
      .map((p) => ({
        ldName: p.LDPlayerGridLD,
        accessToken: p.TokenGridLD,
        phoneFile: p.PhoneFileGridLD,
      }));

    for (const row of toAdd) {
      try {
        await window.electron.addFriends({
          ...row,
          target,
        });

        await fetchLDPlayers();
      } catch (err) {
        console.error(`❌ เพิ่มเพื่อนให้ ${row.ldName} ล้มเหลว`, err);
      }
    }
  };

  const handleCreateGroup = async () => {
    if (!selectedOa || !selectedPrivate) return;

    const selectedList = ldplayers.filter((p) =>
      selectedRows.has(p.LDPlayerGridLD),
    );

    if (selectedList.length === 0) return;

    try {
      for (const selected of selectedList) {
        await window.electron.mainCreateGroup({
          accessToken: selected.TokenGridLD,
          nameGroup: "",
          ldName: selected.LDPlayerGridLD,
          oaId: selectedOa,
          privateId: selectedPrivate,
        });

        await fetchLDPlayers();
      }
    } catch (err) {
      console.error("Create Group Fail:", err);
    }
  };

  useEffect(() => {
    fetchLDPlayers();
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      const list = await window.electron.getTxtFiles();
      setFiles(list);
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    window.electron.getAccountLineId().then(setAccounts);
  }, []);

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
              <TableHead>จำนวนเพื่อน</TableHead>
              <TableHead>จำนวนกลุ่ม</TableHead>
              <TableHead>ชื่อไลน์</TableHead>
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
                    <TableCell>{item.FriendGridLD}</TableCell>
                    <TableCell>{item.GroupGridLD}</TableCell>
                    <TableCell>{item.NameLineGridLD}</TableCell>
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
                      <ContextMenuItem inset onClick={handleCheckban}>
                        ตรวจสอบบัญชีไลน์
                      </ContextMenuItem>
                      <ContextMenuItem inset>ส่งข้อควา่ม</ContextMenuItem>
                      <ContextMenuItem
                        inset
                        onClick={() => setDialogOpen(true)}
                      >
                        เพิ่มเพื่อน
                      </ContextMenuItem>
                      <ContextMenuItem
                        inset
                        onClick={() => setDialogOpenCreateGroup(true)}
                      >
                        สร้างกลุ่ม
                      </ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>LDPlayer</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      <ContextMenuItem inset onClick={handleGetTokenAuto}>
                        เก็บ Token
                      </ContextMenuItem>
                      <ContextMenuItem inset onClick={handleOpenLDPlayer}>
                        เปิด LDPlayer
                      </ContextMenuItem>
                      <ContextMenuItem inset onClick={handleDeleteLDPlayer}>
                        ลบ LDPlayer
                      </ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>
                      เปลี่ยนไฟล์รายชื่อ
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      {files.map((file) => (
                        <ContextMenuItem
                          key={file.name}
                          inset
                          onSelect={() =>
                            handleSelectFile(
                              Array.from(selectedRows),
                              file.name,
                            )
                          }
                        >
                          {file.name} ({file.count})
                        </ContextMenuItem>
                      ))}
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuItem onClick={handleDeleteRow}>
                    ลบแถว
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่มเพื่อน</DialogTitle>
              <DialogDescription>ใส่จำนวนเพื่อนที่ต้องการ</DialogDescription>
            </DialogHeader>
            <Input
              type="number"
              value={friendCount}
              onChange={(e) => setFriendCount(e.target.value)}
            />
            <DialogFooter>
              <Button
                onClick={() => {
                  handleAddFriends();
                  setDialogOpen(false);
                }}
              >
                ยืนยัน
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isDialogOpenCreateGroup}
          onOpenChange={setDialogOpenCreateGroup}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>สร้างกลุ่ม</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Label>ชื่อกลุ่ม</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="ยังไม่เปิดให้ใช้งาน" />
                </SelectTrigger>
              </Select>
              <Label>รูปภาพกลุ่ม</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="ยังไม่เปิดให้ใช้งาน" />
                </SelectTrigger>
              </Select>
              <Label>ไลน์Oa</Label>
              <Select value={selectedOa} onValueChange={setSelectedOa}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือก Oa" />
                </SelectTrigger>
                <SelectContent>
                  {oaAccounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.lineId}>
                      {acc.lineId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label>ไลน์ไก่</Label>
              <Select
                value={selectedPrivate}
                onValueChange={setSelectedPrivate}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือก Private" />
                </SelectTrigger>
                <SelectContent>
                  {privateAccounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.lineId}>
                      {acc.lineId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                className="w-full"
                onClick={() => {
                  handleCreateGroup();
                  setDialogOpenCreateGroup(false);
                }}
              >
                สร้างกลุ่ม
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
