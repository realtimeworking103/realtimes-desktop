import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";
import { Pencil, Plus, Settings, Trash } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/ui/components/ui/table";
import { Button } from "@/ui/components/ui/button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/ui/components/ui/dialog";
import { Input } from "@/ui/components/ui/input";
import { Checkbox } from "@/ui/components/ui/checkbox";
import { Badge } from "@/ui/components/ui/badge";
import { toast } from "sonner";

export default function Page() {
  const [id, setId] = useState<number>(0);
  const [status, setStatus] = useState<any[]>([]);
  const [statusEdit, setStatusEdit] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [statusInput, setStatusInput] = useState("");
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [confirmDeleteIds, setConfirmDeleteIds] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const fetchStatus = () => {
    window.electron.getStatus().then((status) => {
      setStatus(status);
    });
  };

  const handleAddStatus = () => {
    if (statusInput.trim() === "") {
      toast.error("กรุณากรอกสถานะ");
      return;
    }
    window.electron.addStatus(statusInput);
    fetchStatus();
    setOpenDialog(false);
    setStatusInput("");
  };

  const handleEditStatus = (id: number, status: string) => {
    window.electron.updateStatus({ id, status });
    fetchStatus();
    setOpenDialogEdit(false);
  };

  const handleDeleteStatus = (id: number) => {
    window.electron.deleteStatus(id);
    fetchStatus();
    setOpenConfirmDeleteDialog(false);
    setSelectedRows(new Set());
    setConfirmDeleteIds([]);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-svh p-6 select-none">
      <div className="sticky top-0 z-20 mb-4 border-b backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              สถานะ
            </h1>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>จำนวนสถานะ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                จำนวนสถานะทั้งหมด
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {status.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="mx-auto space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>รายการสถานะ</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="lg"
                className="bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
                onClick={() => setOpenDialog(true)}
              >
                <Plus className="h-4 w-4" />
                เพิ่มสถานะ
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className="bg-red-500 transition-colors duration-200 hover:bg-red-600"
                onClick={() => {
                  setConfirmDeleteIds(Array.from(selectedRows));
                  setOpenConfirmDeleteDialog(true);
                }}
              >
                <Trash className="h-4 w-4" />
                ลบสถานะที่เลือก
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
              <div className="overflow-hidden rounded-lg">
                <Table className="[&_*]:text-center [&_*]:align-middle">
                  <TableHeader>
                    <TableRow className="dark:bg-gray-900">
                      <TableHead className="text-center font-semibold text-white">
                        <Checkbox
                          checked={selectedRows.size === status.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRows(
                                new Set(status.map((item) => item.id)),
                              );
                            } else {
                              setSelectedRows(new Set());
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead className="text-center font-semibold text-white">
                        ลำดับ
                      </TableHead>
                      <TableHead className="text-center font-semibold text-white">
                        รายการสถานะ
                      </TableHead>
                      <TableHead className="text-center font-semibold text-white">
                        วันที่สร้าง
                      </TableHead>
                      <TableHead className="text-center font-semibold text-white">
                        การจัดการ
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {status.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.has(item.id)}
                            onCheckedChange={() => toggleRow(item.id)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-sm text-blue-800"
                          >
                            {index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>{item.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="default"
                              size="icon"
                              className="bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
                              onClick={() => {
                                setStatusEdit(item.status);
                                setId(item.id);
                                setOpenDialogEdit(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="bg-red-500 transition-colors duration-200 hover:bg-red-600"
                              onClick={() => {
                                setConfirmDeleteIds((prev) => [
                                  ...prev,
                                  item.id,
                                ]);
                                setOpenConfirmDeleteDialog(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มสถานะ</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="กรอกสถานะ"
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
              />
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="default" onClick={() => setOpenDialog(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={() => {
                handleAddStatus();
              }}
            >
              เพิ่ม
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit */}
      <Dialog open={openDialogEdit} onOpenChange={setOpenDialogEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขสถานะ</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="กรอกสถานะ"
                value={statusEdit}
                onChange={(e) => setStatusEdit(e.target.value)}
              />
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="default" onClick={() => setOpenDialogEdit(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={() => {
                handleEditStatus(id, statusEdit);
                setOpenDialogEdit(false);
              }}
            >
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={openConfirmDeleteDialog}
        onOpenChange={(open) => {
          setOpenConfirmDeleteDialog(open);
          setSelectedRows(new Set());
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบสถานะ</DialogTitle>
            <DialogDescription>คุณต้องการลบสถานะนี้หรือไม่?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="default"
              onClick={() => {
                setOpenConfirmDeleteDialog(false);
                setSelectedRows(new Set());
                setConfirmDeleteIds([]);
              }}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={() => {
                for (const id of confirmDeleteIds) {
                  handleDeleteStatus(id);
                }
                setOpenConfirmDeleteDialog(false);
                setSelectedRows(new Set());
                setConfirmDeleteIds([]);
              }}
            >
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
