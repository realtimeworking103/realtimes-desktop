import { useEffect, useState } from "react";

import { Button } from "@/ui/components/ui/button";
import { RotateCcw, Monitor } from "lucide-react";

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

import { LDPlayerType, StatusType } from "@/ui/types/types";
import { useLDPlayerActions } from "@/ui/hooks/use-ldplayer";

import { ConfirmDialog } from "@/ui/components/confirm-dialog";
import { AddFriendDialog } from "@/ui/components/add-friend-dialog";
import { Input } from "@/ui/components/ui/input";
import { Badge } from "@/ui/components/ui/badge";
import { Semaphore } from "async-mutex";
import { Card, CardContent } from "@/ui/components/ui/card";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/ui/components/ui/tabs";
import { CreateGroupDialog2 } from "@/ui/components/create-group-dialog2";
import { CreateGroupDialog } from "@/ui/components/create-group-dialog";
import { Dialog, DialogContent } from "@/ui/components/ui/dialog";
import { AddMeDialog } from "@/ui/components/add-me-dialog";

export default function Page() {
  const [ldplayers, setLDPlayers] = useState<LDPlayerType[]>([]);
  const [status, setStatus] = useState<StatusType[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const [isDialogOpenAddFriend, setDialogOpenAddFriend] = useState(false);
  const [isDialogOpenAddMe, setDialogOpenAddMe] = useState(false);
  const [isDialogOpenTabCreateGroup, setDialogOpenTabCreateGroup] =
    useState(false);
  const [tabDialog, setTabDialog] = useState<"create" | "create2">("create");

  const [isSelecting, setIsSelecting] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  const [files, setFiles] = useState<{ name: string; count: number }[]>([]);

  const [friendCount, setFriendCount] = useState("49");
  const [search, setSearch] = useState("");
  const [privatePhone, setPrivatePhone] = useState("");

  const fetchLDPlayers = async () => {
    const result = await window.electron.getLDPlayersDB();
    setLDPlayers(result);
  };

  const fetchStatus = async () => {
    const result = await window.electron.getStatus();
    setStatus(result);
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

  const handleSearch = async () => {
    const result = await window.electron.getLDPlayersDB();
    setLDPlayers(
      result.filter(
        (item) =>
          item.LDPlayerGridLD.toLowerCase().includes(search.toLowerCase()) ||
          item.PhoneGridLD.toLowerCase().includes(search.toLowerCase()) ||
          item.NameLineGridLD.toLowerCase().includes(search.toLowerCase()) ||
          item.StatusGridLD.toLowerCase().includes(search.toLowerCase()) ||
          item.StatusAccGridLD.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  };

  const handlefetchLdInstance = async () => {
    try {
      await window.electron.fetchLdInstance();
      setTimeout(() => {
        fetchLDPlayers();
        toast.success("รีเฟรชข้อมูลเรียบร้อย");
      }, 3000);
    } catch (err) {
      toast.error("รีเฟรชข้อมูลไม่สำเร็จ");
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
      if (!row.accessToken || row.accessToken.trim() === "") {
        toast.error(`LDPlayer ${row.ldName} ไม่มี Token หรือ Token ไม่ถูกต้อง`);
        return;
      }

      try {
        await window.electron.addFriends({
          ...row,
          target,
          privatePhone: privatePhone,
        });

        await window.electron.getTxtFiles();
        await window.electron.updatePhoneFile({
          ldName: row.ldName,
          fileName: row.phoneFile,
        });
        await fetchLDPlayers();
      } catch (err) {
        toast.error(`เพิ่มเพื่อนให้ ${row.ldName} ล้มเหลว`);
      }
    }
  };

  const handleCreateGroup = async (
    nameGroup: string,
    profile: string,
    oaId: string,
  ) => {
    const selectedList = ldplayers.filter((p) =>
      selectedRows.has(p.LDPlayerGridLD),
    );

    if (selectedList.length === 0) return;

    try {
      const semaphore = new Semaphore(1);
      await Promise.all(
        selectedList.map(async (selected) => {
          const [_, release] = await semaphore.acquire();
          if (!selected.TokenGridLD || selected.TokenGridLD.trim() === "") {
            toast.error(
              `LDPlayer ${selected.LDPlayerGridLD} ไม่มี Token หรือ Token ไม่ถูกต้อง`,
            );
            release();
            return;
          }
          try {
            await window.electron.mainCreateChat({
              ldName: selected.LDPlayerGridLD,
              accessToken: selected.TokenGridLD,
              nameGroup: nameGroup,
              searchId: oaId,
              profile: profile,
            });
            await fetchLDPlayers();
            release();
          } catch (error) {
            console.log(error);
          }
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateGroup2 = async (
    nameGroup: string,
    profile: string,
    message: string,
    oaId: string,
  ) => {
    const selectedList = ldplayers.filter((p) =>
      selectedRows.has(p.LDPlayerGridLD),
    );

    if (selectedList.length === 0) return;

    try {
      const semaphore = new Semaphore(1);
      await Promise.all(
        selectedList.map(async (selected) => {
          const [_, release] = await semaphore.acquire();
          if (!selected.TokenGridLD || selected.TokenGridLD.trim() === "") {
            toast.error(
              `LDPlayer ${selected.LDPlayerGridLD} ไม่มี Token หรือ Token ไม่ถูกต้อง`,
            );
            release();
            return;
          }
          try {
            await new Promise((resolve) => setTimeout(resolve, 50000));
            await window.electron.createChat({
              accessToken: selected.TokenGridLD,
              ldName: selected.LDPlayerGridLD,
              profile: profile,
              nameGroup: nameGroup,
              searchId: oaId,
              message: message,
            });
            await fetchLDPlayers();
            release();
          } catch (error) {
            console.log(error);
            release();
          }
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeStatus = async (status: string) => {
    const selectedList = ldplayers.filter((p) =>
      selectedRows.has(p.LDPlayerGridLD),
    );

    if (selectedList.length === 0) return;

    for (const row of selectedList) {
      try {
        await window.electron.updateStatusLDPlayer({
          id: row.NoDataGridLD,
          status,
        });
        await fetchLDPlayers();
      } catch (error) {
        toast.error("เปลี่ยนสถานะไม่สำเร็จ");
      }
    }
  };

  const handleAddMe = async (userId: string) => {
    const selectedList = ldplayers.filter((p) =>
      selectedRows.has(p.LDPlayerGridLD),
    );

    if (selectedList.length === 0) return;

    for (const row of selectedList) {
      if (!row.TokenGridLD || row.TokenGridLD.trim() === "") {
        toast.error(
          `LDPlayer ${row.LDPlayerGridLD} ไม่มี Token หรือ Token ไม่ถูกต้อง`,
        );
        return;
      }

      try {
        await window.electron.findAndAddFriend({
          accessToken: row.TokenGridLD,
          ldName: row.LDPlayerGridLD,
          userId: userId,
        });
        await fetchLDPlayers();
      } catch (error) {
        toast.error("เพิ่มเพื่อนหาตัวเองไม่สำเร็จ");
      }
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
    fetchStatus();
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      const list = await window.electron.getTxtFiles();
      setFiles(list);
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search]);

  return (
    <div className="min-h-svh p-6 select-none">
      <div className="sticky top-0 z-20 mb-4 border-b backdrop-blur select-none dark:border-gray-700 dark:bg-gray-900/80">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Monitor className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              จัดการ LDPlayer
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="ค้นหา LDPlayer"
              className="w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button
              onClick={handlefetchLdInstance}
              variant="default"
              className="bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
              size="lg"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              รีเฟรชข้อมูล
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="h-[700px] overflow-y-auto">
            <div>
              <div className="min-w-[1000px]">
                <div
                  onMouseLeave={() => setIsSelecting(false)}
                  className="select-none"
                >
                  <Table className="[&_*]:text-center [&_*]:align-middle">
                    <TableHeader className="sticky top-0 z-10 dark:bg-gray-900">
                      <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <TableHead>ลำดับ</TableHead>
                        <TableHead>LDPLAYER</TableHead>
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
                                  setSelectedRows(
                                    new Set([item.LDPlayerGridLD]),
                                  );
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
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-800"
                                >
                                  {item.NoDataGridLD}
                                </Badge>
                              </TableCell>
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
                                  ส่งข้อความ
                                </ContextMenuItem>
                                <ContextMenuItem
                                  inset
                                  onClick={() => setDialogOpenAddFriend(true)}
                                >
                                  เพิ่มเพื่อน
                                </ContextMenuItem>
                                <ContextMenuItem
                                  inset
                                  onClick={() => setDialogOpenAddMe(true)}
                                >
                                  เพิ่มเพื่อนหาตัวเอง
                                </ContextMenuItem>
                                <ContextMenuItem
                                  inset
                                  onClick={() => {
                                    setDialogOpenTabCreateGroup(true);
                                  }}
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
                                เปลี่ยนสถานะ
                              </ContextMenuSubTrigger>
                              <ContextMenuSubContent>
                                {status.map((item) => (
                                  <ContextMenuItem
                                    key={item.id}
                                    inset
                                    onClick={() =>
                                      handleChangeStatus(item.status)
                                    }
                                  >
                                    {item.status}
                                  </ContextMenuItem>
                                ))}
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
          </div>
        </CardContent>
      </Card>

      {/* Summary Bar */}
      <div className="mt-4 flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div>
          <span className="font-sans text-sm">LDPlayer ทั้งหมด:</span>{" "}
          {ldplayers.length}
          <span className="mx-3 font-sans text-sm">เลือก:</span>{" "}
          {selectedRows.size}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-2 rounded bg-blue-50 px-6 py-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
        💡 <b>Tips:</b> กด <kbd>Ctrl</kbd> หรือ <kbd>Shift</kbd>{" "}
        เพื่อเลือกหลายแถว, คลิกขวาเพื่อดูเมนูเพิ่มเติม
      </div>

      {/* AddFriendDialog */}
      <AddFriendDialog
        open={isDialogOpenAddFriend}
        value={friendCount}
        onChange={setFriendCount}
        onCancel={() => setDialogOpenAddFriend(false)}
        onConfirm={() => {
          handleAddFriends();
          setDialogOpenAddFriend(false);
        }}
        privatePhone={privatePhone}
        onChangePrivatePhone={setPrivatePhone}
      />

      {/* AddMeDialog */}
      <AddMeDialog
        open={isDialogOpenAddMe}
        onCancel={() => setDialogOpenAddMe(false)}
        onConfirm={(userId) => {
          handleAddMe(userId);
          setDialogOpenAddMe(false);
        }}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        message={confirmDialog.message}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={() => {
          if (confirmDialog.action) confirmDialog.action();
          setConfirmDialog({ open: false, action: null, message: "" });
        }}
      />

      {/* Tab Menu */}
      <Dialog
        open={isDialogOpenTabCreateGroup}
        onOpenChange={setDialogOpenTabCreateGroup}
      >
        <DialogContent>
          <Tabs
            value={tabDialog}
            onValueChange={(value) =>
              setTabDialog(value as "create" | "create2")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">สร้างกลุ่มแบบที่ 1</TabsTrigger>
              <TabsTrigger value="create2">สร้างกลุ่มแบบที่ 2</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <CreateGroupDialog
                onCancel={() => setDialogOpenTabCreateGroup(false)}
                onConfirm={handleCreateGroup}
              />
            </TabsContent>
            <TabsContent value="create2">
              <CreateGroupDialog2
                onCancel={() => setDialogOpenTabCreateGroup(false)}
                onConfirm={handleCreateGroup2}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
