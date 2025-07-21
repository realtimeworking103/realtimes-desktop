import { useEffect, useState } from "react";

import { Button } from "@/ui/components/ui/button";
import { RefreshCw } from "lucide-react";

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
import { useLDPlayerActions } from "@/ui/hooks/use-LDPlayerActions";

import { ConfirmDialog } from "@/ui/components/confirm-dialog";
import { AddFriendDialog } from "@/ui/components/add-friend-dialog";
import { CreateGroupDialog } from "@/ui/components/create-group-dialog";

export default function Page() {
  const [ldplayers, setLDPlayers] = useState<LDPlayerType[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  const [files, setFiles] = useState<{ name: string; count: number }[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [friendCount, setFriendCount] = useState("");

  const [isDialogOpenCreateGroup, setDialogOpenCreateGroup] = useState(false);

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
      setTimeout(() => {
        fetchLDPlayers();
      }, 3000);
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
        console.error(`เพิ่มเพื่อนให้ ${row.ldName} ล้มเหลว`, err);
      }
    }
  };

  const handleCreateGroup = async () => {
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
          oaId: "",
          privateId: "",
        });

        await fetchLDPlayers();
      }
    } catch (err) {
      console.error("Create Group Fail:", err);
    }
  };

  // Confirm dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: null | (() => void);
    message: string;
  }>({ open: false, action: null, message: "" });

  // Handler to open confirm dialog
  const openConfirmDialog = (message: string, action: () => void) => {
    setConfirmDialog({ open: true, action, message });
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

  return (
    <>
      <div className="sticky top-0 z-20 mb-4 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/desktopIcon.png" alt="LDPlayer" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              จัดการ LDPlayer
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlefetchLdInstance} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              รีเฟรชข้อมูล
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl space-y-4">
        <div onMouseLeave={() => setIsSelecting(false)} className="select-none">
          <div className="max-h-150 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
            <div className="overflow-x-auto">
              <div className="min-w-[1000px] overflow-hidden border-gray-200">
                <Table className="[&_*]:text-center [&_*]:align-middle">
                  <TableHeader className="sticky top-0 z-10 bg-gray-50">
                    <TableRow>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        ลำดับ
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        LDPlayer
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        สถานะบัญชีไลน์
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        ทำงานครั้งล่าสุด
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        สถานะการทำงาน
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        จำนวนเพื่อน
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        จำนวนกลุ่ม
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        ชื่อไลน์
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        เบอร์ไลน์
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        Token
                      </TableHead>
                      <TableHead className="bg-gray-50 font-semibold text-gray-700">
                        วันที่สมัครไลน์
                      </TableHead>
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
                            <ContextMenuSubTrigger>
                              ฟังชั่น
                            </ContextMenuSubTrigger>
                            <ContextMenuSubContent>
                              <ContextMenuItem
                                inset
                                onClick={() =>
                                  openConfirmDialog(
                                    "คุณแน่ใจหรือไม่ที่จะตรวจสอบบัญชีไลน์นี้?",
                                    handleCheckban,
                                  )
                                }
                              >
                                ตรวจสอบบัญชีไลน์
                              </ContextMenuItem>
                              <ContextMenuItem inset>
                                ส่งข้อควา่ม
                              </ContextMenuItem>
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
                            <ContextMenuSubTrigger>
                              LDPlayer
                            </ContextMenuSubTrigger>
                            <ContextMenuSubContent>
                              <ContextMenuItem
                                inset
                                onClick={() =>
                                  openConfirmDialog(
                                    "คุณแน่ใจหรือไม่ที่จะเก็บ Token?",
                                    handleGetTokenAuto,
                                  )
                                }
                              >
                                เก็บ Token
                              </ContextMenuItem>
                              <ContextMenuItem
                                inset
                                onClick={() =>
                                  openConfirmDialog(
                                    "คุณแน่ใจหรือไม่ที่จะเปิด LDPlayer นี้?",
                                    handleOpenLDPlayer,
                                  )
                                }
                              >
                                เปิด LDPlayer
                              </ContextMenuItem>
                              <ContextMenuItem
                                inset
                                onClick={() =>
                                  openConfirmDialog(
                                    "คุณแน่ใจหรือไม่ที่จะลบ LDPlayer นี้?",
                                    handleDeleteLDPlayer,
                                  )
                                }
                              >
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
                          <ContextMenuItem
                            onClick={() =>
                              openConfirmDialog(
                                "คุณแน่ใจหรือไม่ที่จะลบแถวนี้?",
                                handleDeleteRow,
                              )
                            }
                          >
                            ลบแถว
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* AddFriendDialog */}
          <AddFriendDialog
            open={isDialogOpen}
            value={friendCount}
            onChange={setFriendCount}
            onCancel={() => setDialogOpen(false)}
            onConfirm={() => {
              handleAddFriends();
              setDialogOpen(false);
            }}
          />

          <CreateGroupDialog
            open={isDialogOpenCreateGroup}
            oaAccounts={[]}
            privateAccounts={[]}
            selectedOa={""}
            setSelectedOa={() => {}}
            selectedPrivate={""}
            setSelectedPrivate={() => {}}
            onCancel={() => setDialogOpenCreateGroup(false)}
            onConfirm={() => {
              handleCreateGroup();
              setDialogOpenCreateGroup(false);
            }}
          />

          {/* Confirm Dialog */}
          <ConfirmDialog
            open={confirmDialog.open}
            message={confirmDialog.message}
            onCancel={() =>
              setConfirmDialog((prev) => ({ ...prev, open: false }))
            }
            onConfirm={() => {
              if (confirmDialog.action) confirmDialog.action();
              setConfirmDialog({ open: false, action: null, message: "" });
            }}
          />

          {/* Summary Bar */}
          <div className="mt-4 flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
            <div>
              <span className="font-semibold">LDPlayer ทั้งหมด:</span>{" "}
              {ldplayers.length}
              <span className="mx-3 font-semibold">เลือก:</span>{" "}
              {selectedRows.size}
            </div>
            <div className="text-sm text-gray-500">
              Powered by RealTimes Desktop
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 rounded bg-blue-50 px-6 py-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
            💡 <b>Tips:</b> กด <kbd>Ctrl</kbd> หรือ <kbd>Shift</kbd>{" "}
            เพื่อเลือกหลายแถว, คลิกขวาเพื่อดูเมนูเพิ่มเติม
          </div>

          {/* Footer */}
          <footer className="mt-8 w-full py-4 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} RealTimes Desktop | Version 1.0.0 |{" "}
            <a href="https://yourwebsite.com" className="underline">
              Support
            </a>
          </footer>
        </div>
      </div>
    </>
  );
}
