import { List, Pencil, Plus, Trash, Upload } from "lucide-react";
import { Table } from "@/ui/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";
import { Button } from "@/ui/components/ui/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table";
import { useEffect, useState } from "react";
import { NameGroupType } from "@/ui/types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/components/ui/dialog";
import { Input } from "@/ui/components/ui/input";
import { Checkbox } from "@/ui/components/ui/checkbox";
import { Badge } from "@/ui/components/ui/badge";

export default function Page() {
  const [nameGroup, setNameGroup] = useState<NameGroupType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [confirmDeleteIds, setConfirmDeleteIds] = useState<number[]>([]);

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

  const handleFetchNameGroup = async () => {
    const result = await window.electron.getFileNameGroup();
    setNameGroup(result as unknown as NameGroupType[]);
  };

  const handleSelectFile = async () => {
    const result = await window.electron.selectFileNameGroup();
    if (!result) return;
    handleFetchNameGroup();
  };

  const handleAddNameGroup = async (name: string, description: string) => {
    const result = await window.electron.addNameGroup({
      name: name.trim(),
      description: description.trim(),
    });
    if (!result) return;
    handleFetchNameGroup();
    setOpenDialog(false);
    setName("");
    setDescription("");
  };

  const handleDeleteNameGroup = async (ids: number[]) => {
    for (const id of ids) {
      const result = await window.electron.deleteNameGroup(id);
      if (!result) return;
    }
    handleFetchNameGroup();
    setSelectedRows(new Set());
  };

  const handleEditNameGroup = async (
    id: number,
    name: string,
    description: string,
  ) => {
    const result = await window.electron.editNameGroup({
      id,
      name,
      description,
    });
    if (!result) return;
    handleFetchNameGroup();
    setSelectedRows(new Set());
    setOpenEditDialog(false);
    setName("");
    setDescription("");
    setId(0);
  };

  useEffect(() => {
    handleFetchNameGroup();
  }, []);

  return (
    <div className="min-h-svh p-6 select-none">
      {/* Header */}
      <div className="sticky top-0 z-20 mb-4 border-b backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <List className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-white">จัดการชื่อ</h1>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>จำนวนชื่อกลุ่ม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                จำนวนชื่อกลุ่มทั้งหมด
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {nameGroup.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="mx-auto space-y-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>รายการชื่อกลุ่ม</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="lg"
                className="bg-green-500 transition-colors duration-200 hover:bg-green-600"
                onClick={handleSelectFile}
              >
                <Upload className="h-4 w-4" />
                นำเข้าชื่อกลุ่ม
              </Button>
              <Button
                variant="default"
                size="lg"
                className="bg-blue-500 transition-colors duration-200 hover:bg-blue-600"
                onClick={() => setOpenDialog(true)}
              >
                <Plus className="h-4 w-4" />
                เพิ่มชื่อกลุ่ม
              </Button>
              <Button
                variant="default"
                size="lg"
                className="bg-red-500 transition-colors duration-200 hover:bg-red-600"
                onClick={() => {
                  setConfirmDeleteIds(Array.from(selectedRows));
                  setOpenConfirmDeleteDialog(true);
                }}
              >
                <Trash className="h-4 w-4" />
                ลบรายการที่เลือก
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
              <div className="overflow-hidden rounded-lg">
                <Table className="[&_*]:text-center [&_*]:align-middle">
                  <TableHeader className="dark:bg-gray-900">
                    <TableRow className="dark:bg-gray-900">
                      <TableHead className="text-center font-semibold text-white">
                        <Checkbox
                          checked={
                            nameGroup.length > 0 &&
                            selectedRows.size === nameGroup.length
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRows(
                                new Set(nameGroup.map((item) => item.id)),
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
                        ชื่อกลุ่ม
                      </TableHead>
                      <TableHead className="text-center font-semibold text-white">
                        รายละเอียด
                      </TableHead>
                      <TableHead className="text-center font-semibold text-white">
                        วันที่สร้าง
                      </TableHead>
                      <TableHead className="text-center font-semibold text-white">
                        จัดการ
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nameGroup.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={selectedRows.has(item.id)}
                            onCheckedChange={() => toggleRow(item.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-sm text-blue-800"
                          >
                            {index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.createAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
                              onClick={() => {
                                setName(item.name);
                                setDescription(item.description);
                                setId(item.id);
                                setOpenEditDialog(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-500 transition-colors duration-200 hover:bg-red-600"
                              onClick={() => {
                                setConfirmDeleteIds([item.id]);
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
            <DialogTitle>เพิ่มชื่อกลุ่ม</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Input
              placeholder="ชื่อกลุ่ม"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
            <Button
              onClick={() => {
                handleAddNameGroup(name, description);
                setOpenDialog(false);
                setName("");
                setDescription("");
              }}
            >
              เพิ่ม
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={openConfirmDeleteDialog}
        onOpenChange={setOpenConfirmDeleteDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบชื่อกลุ่ม</DialogTitle>
            <DialogDescription>
              คุณต้องการลบชื่อกลุ่มนี้หรือไม่?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="default"
              onClick={() => setOpenConfirmDeleteDialog(false)}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={() => {
                handleDeleteNameGroup(confirmDeleteIds);
                setOpenConfirmDeleteDialog(false);
              }}
            >
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขชื่อกลุ่ม</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="ชื่อกลุ่ม"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="รายละเอียด"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="default" onClick={() => setOpenEditDialog(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={() => {
                handleEditNameGroup(id, name, description);
                setOpenEditDialog(false);
                setName("");
                setDescription("");
                setId(0);
              }}
            >
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
