"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Checkbox } from "@/ui/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";
import { Badge } from "@/ui/components/ui/badge";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table";
import { callLdInstance } from "@/ui/api";
import { CreatedLDPlayerType } from "@/ui/types/types";
import {
  Plus,
  Hash,
  Move,
  Play,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Monitor,
  Clock,
  Settings,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/ui/components/ui/alert-dialog";

export default function Page() {
  const [prefix, setPrefix] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [ldData, setLdData] = useState<CreatedLDPlayerType[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openMoveDialog, setOpenMoveDialog] = useState(false);
  const [openOpenDialog, setOpenOpenDialog] = useState<{
    open: boolean;
    name: string | null;
  }>({ open: false, name: null });
  const [openDeleteDialog, setOpenDeleteDialog] = useState<{
    open: boolean;
    name: string | null;
  }>({ open: false, name: null });

  const toggleRow = (id: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const cancelCreateRef = useRef(false);

  const handleCreate = async () => {
    if (!prefix || !count) return;
    setLoading(true);
    cancelCreateRef.current = false;
    setProgress({ current: 0, total: count });

    try {
      for (let i = 1; i <= count; i++) {
        if (cancelCreateRef.current) {
          console.log("ยกเลิกการสร้าง LDPlayer");
          toast.warning("ยกเลิกการสร้าง LDPlayer");
          break;
        }
        const result = await window.electron.createLdInstance({
          prefix,
          count: i,
        });

        console.log(`สร้าง LDPlayer ${i}:`, result);

        const data = await window.electron.getDataCreateLDPlayers();
        setLdData(data);
        setProgress({ current: i, total: count });
      }
      if (!cancelCreateRef.current) {
        toast.success("สร้าง LDPlayer เสร็จสิ้นทั้งหมด");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างสร้าง LDPlayer:", error);
      toast.error("เกิดข้อผิดพลาดระหว่างสร้าง LDPlayer");
    } finally {
      setLoading(false);
      console.log("สร้าง LDPlayer เสร็จสิ้นทั้งหมด");
      setProgress({ current: 0, total: 0 });
    }
  };

  const handleCancelCreate = () => {
    cancelCreateRef.current = true;
    setLoading(false);
  };

  const handleOpenLDPlayer = async (name: string) => {
    try {
      const result = await callLdInstance(name);
      console.log(`Opened LDPlayer: ${name}`, result);
    } catch (error) {
      console.error(`Failed to open LDPlayer ${name}:`, error);
    }
  };

  const handleMoveSelected = async () => {
    if (selectedRows.size === 0) {
      console.log("No rows selected.");
      return;
    }

    const selectedLDNames = ldData
      .filter((item) => selectedRows.has(item.NoDataGridLD))
      .map((item) => item.LDPlayerGridLD);

    try {
      console.log("Moving selected LDPlayers:", selectedLDNames);

      const result =
        await window.electron.moveSelectedLDPlayers(selectedLDNames);
      console.log("Move result:", result);

      const updated = await window.electron.getDataCreateLDPlayers();
      setLdData(updated);
      console.log("Refreshed data after move.");
    } catch (error) {
      console.error("Error moving selected LDPlayers:", error);
    }
  };

  const handleDeleteLDPlayer = async (name: string) => {
    try {
      const result = await import("@/ui/api").then((m) =>
        m.deleteLdInstance(name),
      );
      if (result) {
        toast.success(`ลบ LDPlayer ${name} สำเร็จ`);
        const data = await window.electron.getDataCreateLDPlayers();
        setLdData(data);
      } else {
        toast.error(`ลบ LDPlayer ${name} ไม่สำเร็จ`);
      }
    } catch (error) {
      toast.error(`เกิดข้อผิดพลาดขณะลบ LDPlayer ${name}`);
      console.error(error);
    }
  };

  useEffect(() => {
    window.electron.getDataCreateLDPlayers().then((data) => {
      setLdData(data);
      setSelectedRows(new Set(data.map((item) => item.NoDataGridLD)));
    });
  }, []);

  return (
    <div className="min-h-svh p-6 select-none">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              สร้าง LDPlayer
            </h1>
            <p className="text-gray-600">
              สร้างและจัดการ LDPlayer หลายเครื่องได้อย่างรวดเร็ว
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              className="rounded-lg bg-purple-600 px-6 py-3 text-white shadow-lg transition-all duration-200 hover:bg-purple-700 hover:shadow-xl"
              onClick={() => setOpenCreateDialog(true)}
              disabled={loading || !prefix || !count}
            >
              <Plus className="mr-2 h-5 w-5" />
              {loading ? "กำลังสร้าง..." : "สร้าง LDPlayer"}
            </Button>
            {loading && (
              <Button
                variant="destructive"
                className="rounded-lg bg-red-500 px-6 py-3 text-white shadow-lg transition-all duration-200 hover:bg-red-600 hover:shadow-xl"
                onClick={() => setOpenCancelDialog(true)}
              >
                <XCircle className="mr-2 h-5 w-5" />
                หยุดสร้าง
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {loading && progress.total > 0 && (
          <div className="rounded-lg border border-purple-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  กำลังสร้าง LDPlayer
                </span>
              </div>
              <span className="font-mono text-xs text-gray-500">
                {progress.current} / {progress.total}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-200 ease-out"
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Create Form */}
        <Card className="border-0 bg-white/90 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              สร้าง LDPlayer ใหม่
            </CardTitle>
            <CardDescription>
              กำหนด prefix และจำนวนที่ต้องการสร้าง
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-4">
              <div className="relative min-w-[200px] flex-1">
                <User className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="h-12 pl-10 text-base"
                />
              </div>
              <div className="relative min-w-[200px] flex-1">
                <Hash className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="จำนวนที่ต้องการสร้าง"
                  className="h-12 pl-10 text-base"
                  value={count ?? ""}
                  onChange={(e) => setCount(Number(e.target.value))}
                />
              </div>
              <Button
                variant="secondary"
                className="h-12 bg-blue-600 px-6 text-white hover:bg-blue-700"
                onClick={() => setOpenMoveDialog(true)}
                disabled={selectedRows.size === 0}
              >
                <Move className="mr-2 h-5 w-5" />
                ย้ายข้อมูลที่เลือก ({selectedRows.size})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* LDPlayers Table */}
        <Card className="border-0 bg-white/90 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              รายการ LDPlayer
            </CardTitle>
            <CardDescription>จัดการ LDPlayer ที่สร้างไว้</CardDescription>
          </CardHeader>
          <CardContent>
            {ldData.length === 0 ? (
              <div className="py-12 text-center">
                <Monitor className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  ไม่มี LDPlayer
                </h3>
                <p className="mb-4 text-gray-500">
                  ยังไม่มี LDPlayer ที่สร้างไว้
                </p>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-gray-50">
                      <TableRow className="hover:bg-gray-50">
                        <TableHead className="w-12 bg-gray-50 text-center font-semibold text-gray-700">
                          <Checkbox
                            checked={
                              ldData.length > 0 &&
                              selectedRows.size === ldData.length
                            }
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRows(
                                  new Set(
                                    ldData.map((item) => item.NoDataGridLD),
                                  ),
                                );
                              } else {
                                setSelectedRows(new Set());
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                          ลำดับ
                        </TableHead>
                        <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                          LDPlayer
                        </TableHead>
                        <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                          เวลาที่สร้าง
                        </TableHead>
                        <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                          สถานะ
                        </TableHead>
                        <TableHead className="bg-gray-50 text-center font-semibold text-gray-700">
                          การดำเนินการ
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ldData.map((item) => (
                        <TableRow
                          key={item.NoDataGridLD}
                          className="transition-colors duration-200 hover:bg-purple-50/50"
                        >
                          <TableCell className="text-center">
                            <Checkbox
                              checked={selectedRows.has(item.NoDataGridLD)}
                              onCheckedChange={() =>
                                toggleRow(item.NoDataGridLD)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="secondary"
                              className="bg-purple-100 text-purple-800"
                            >
                              {item.NoDataGridLD}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Monitor className="mr-2 h-4 w-4 text-purple-500" />
                              <span className="font-medium text-gray-900">
                                {item.LDPlayerGridLD}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center text-gray-600">
                              <Clock className="mr-2 h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {item.DateTimeGridLD
                                  ? new Date(
                                      item.DateTimeGridLD,
                                    ).toLocaleString("th-TH", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "-"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                item.StatusGridLD === "success"
                                  ? "default"
                                  : "destructive"
                              }
                              className={
                                item.StatusGridLD === "success"
                                  ? "border-green-200 bg-green-100 text-green-800"
                                  : item.StatusGridLD === "pending"
                                    ? "border-yellow-200 bg-yellow-100 text-yellow-800"
                                    : item.StatusGridLD === "processing"
                                      ? "border-blue-200 bg-blue-100 text-blue-800"
                                      : "border-red-200 bg-red-100 text-red-800"
                              }
                            >
                              {item.StatusGridLD === "success" ? (
                                <div className="flex items-center">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  สำเร็จ
                                </div>
                              ) : item.StatusGridLD === "pending" ? (
                                <div className="flex items-center">
                                  <Clock className="mr-1 h-3 w-3" />
                                  รอดำเนินการ
                                </div>
                              ) : item.StatusGridLD === "processing" ? (
                                <div className="flex items-center">
                                  <Settings className="mr-1 h-3 w-3 animate-spin" />
                                  กำลังดำเนินการ
                                </div>
                              ) : item.StatusGridLD === "failed" ? (
                                <div className="flex items-center">
                                  <XCircle className="mr-1 h-3 w-3" />
                                  ล้มเหลว
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                  ไม่ทราบสถานะ
                                </div>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                onClick={() =>
                                  handleOpenLDPlayer(item.LDPlayerGridLD)
                                }
                                size="sm"
                                variant="outline"
                                className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={() =>
                                  setOpenDeleteDialog({
                                    open: true,
                                    name: item.LDPlayerGridLD,
                                  })
                                }
                                size="sm"
                                variant="destructive"
                                className="bg-red-500 hover:bg-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AlertDialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการสร้าง LDPlayer</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการสร้าง LDPlayer จำนวน {count ?? 0} เครื่อง ด้วย prefix "
              {prefix}" หรือไม่?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setOpenCreateDialog(false);
                await handleCreate();
              }}
            >
              ยืนยัน
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openCancelDialog} onOpenChange={setOpenCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการหยุดสร้าง</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการหยุดการสร้าง LDPlayer หรือไม่?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpenCancelDialog(false);
                handleCancelCreate();
              }}
            >
              ยืนยัน
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openMoveDialog} onOpenChange={setOpenMoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการย้ายข้อมูล</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการย้ายข้อมูล LDPlayer ที่เลือก ({selectedRows.size}{" "}
              เครื่อง) หรือไม่?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setOpenMoveDialog(false);
                await handleMoveSelected();
              }}
            >
              ยืนยัน
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={openOpenDialog.open}
        onOpenChange={(open) =>
          setOpenOpenDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการเปิด LDPlayer</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการเปิด LDPlayer "{openOpenDialog.name}" หรือไม่?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setOpenOpenDialog({ open: false, name: null });
                if (openOpenDialog.name)
                  await handleOpenLDPlayer(openOpenDialog.name);
              }}
            >
              ยืนยัน
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={openDeleteDialog.open}
        onOpenChange={(open) =>
          setOpenDeleteDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ LDPlayer</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบ LDPlayer "{openDeleteDialog.name}" หรือไม่?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setOpenDeleteDialog({ open: false, name: null });
                if (openDeleteDialog.name)
                  await handleDeleteLDPlayer(openDeleteDialog.name);
              }}
            >
              ยืนยัน
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
