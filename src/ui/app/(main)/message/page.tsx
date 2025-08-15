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
import { MessageType } from "@/ui/types/types";
import { Label } from "@/ui/components/ui/label";

export default function Page() {
  const [message, setMessage] = useState<MessageType[]>([] as MessageType[]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [nameMessage, setNameMessage] = useState("");
  const [messageText, setMessageText] = useState("");
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

  const handleFetchMessage = async () => {
    const result = await window.electron.getMessage();
    setMessage(result as unknown as MessageType[]);
  };

  const handleAddMessage = async (nameMessage: string, message: string) => {
    const result = await window.electron.addMessage({
      nameMessage: nameMessage.trim(),
      message: message.trim(),
    });
    if (!result) return;
    handleFetchMessage();
    setOpenDialog(false);
    setNameMessage("");
    setMessageText("");
  };

  const handleDeleteMessage = async (ids: number[]) => {
    for (const id of ids) {
      const result = await window.electron.deleteMessage(id);
      if (!result) return;
    }
    handleFetchMessage();
    setSelectedRows(new Set());
  };

  const handleEditMessage = async (
    id: number,
    nameMessage: string,
    message: string,
  ) => {
    const result = await window.electron.editMessage({
      id,
      nameMessage: nameMessage.trim(),
      message: message.trim(),
    });
    if (!result) return;
    handleFetchMessage();
    setSelectedRows(new Set());
    setOpenEditDialog(false);
    setNameMessage("");
    setMessageText("");
    setId(0);
  };

  useEffect(() => {
    handleFetchMessage();
  }, []);

  return (
    <div className="min-h-svh p-6 select-none">
      {/* Header */}
      <div className="sticky top-0 z-20 mb-4 border-b backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <List className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-white">จัดการข้อความ</h1>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>จำนวนข้อความ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                จำนวนข้อความทั้งหมด
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {message.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="mx-auto space-y-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>รายการข้อความ</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="lg"
                className="bg-green-500 text-white transition-colors duration-200 hover:bg-green-600"
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                <Upload className="h-4 w-4" />
                นำเข้าข้อความ
              </Button>
              <Button
                variant="default"
                size="lg"
                className="bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
                onClick={() => setOpenDialog(true)}
              >
                <Plus className="h-4 w-4" />
                เพิ่มข้อความ
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
                            message.length > 0 &&
                            selectedRows.size === message.length
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRows(
                                new Set(message.map((item) => item.id)),
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
                        ชื่อข้อความ
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
                    {message.map((item, index) => (
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
                        <TableCell>{item.nameMessage}</TableCell>
                        <TableCell>{item.message}</TableCell>
                        <TableCell>{item.createAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
                              onClick={() => {
                                setNameMessage(item.nameMessage);
                                setMessageText(item.message);
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
            <DialogTitle>เพิ่มข้อความ</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <Label>ชื่อ</Label>
                <Input
                  placeholder="กรอกชื่อ"
                  value={nameMessage}
                  onChange={(e) => setNameMessage(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>ข้อความ</Label>
                <Input
                  placeholder="กรอกข้อความ"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
            <Button
              onClick={() => {
                handleAddMessage(nameMessage, messageText);
                setOpenDialog(false);
                setNameMessage("");
                setMessageText("");
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
            <DialogTitle>ยืนยันการลบข้อความ</DialogTitle>
            <DialogDescription>
              คุณต้องการลบข้อความนี้หรือไม่?
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
                handleDeleteMessage(confirmDeleteIds);
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
            <DialogTitle>แก้ไขข้อความ</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="ชื่อข้อความ"
                value={nameMessage}
                onChange={(e) => setNameMessage(e.target.value)}
              />
              <Input
                placeholder="ข้อความ"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="default" onClick={() => setOpenEditDialog(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={() => {
                handleEditMessage(id, nameMessage, messageText);
                setOpenEditDialog(false);
                setNameMessage("");
                setMessageText("");
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
