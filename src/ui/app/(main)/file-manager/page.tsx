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
import { Button } from "@/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/ui/card";
import { Badge } from "@/ui/components/ui/badge";
import { FileText, Trash2, Upload, FolderOpen, Calendar, Hash } from "lucide-react";

type TxtFile = { name: string; count: number; path: string; createAt: string };

export default function Page() {
  const [files, setFiles] = useState<TxtFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const data = await window.electron.getTxtFiles();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFile = async () => {
    const result = await window.electron.selectTextFile();

    if (!result || !result.path) {
      console.log("ยกเลิกหรือไม่มีไฟล์");
      return;
    }

    const { name, count, path } = result;

    const success = await window.electron.saveTxtFile({ name, count, path });
    if (success) {
      console.log("บันทึกสำเร็จ");
      fetchFiles();
    } else {
      console.log("บันทึกล้มเหลว");
    }
  };

  const handleDelete = async (fileName: string) => {
    const success = await window.electron.deleteTxtFile(fileName);
    if (success) {
      fetchFiles();
    } else {
      console.log("ลบไฟล์ไม่สำเร็จ");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const totalFiles = files.length;
  const totalNumbers = files.reduce((sum, file) => sum + file.count, 0);

  return (
    <div className="min-h-svh  p-6 select-none">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการไฟล์ .txt</h1>
            <p className="text-gray-600">อัปโหลดและจัดการไฟล์ข้อความของคุณ</p>
          </div>
          <Button 
            onClick={handleSelectFile} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <Upload className="mr-2 h-5 w-5" />
            เลือกไฟล์ .txt
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ไฟล์ทั้งหมด</p>
                  <p className="text-3xl font-bold text-blue-600">{totalFiles}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">จำนวนเบอร์ทั้งหมด</p>
                  <p className="text-3xl font-bold text-green-600">{totalNumbers.toLocaleString()}</p>
                </div>
                <Hash className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ไฟล์ล่าสุด</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {files.length > 0 ? files[0].name : "ไม่มีไฟล์"}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Files Table */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">รายการไฟล์</CardTitle>
            <CardDescription>จัดการไฟล์ .txt ที่อัปโหลดไว้</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">กำลังโหลด...</span>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีไฟล์</h3>
                <p className="text-gray-500 mb-4">ยังไม่มีไฟล์ .txt ที่อัปโหลดไว้</p>
                <Button onClick={handleSelectFile} variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  อัปโหลดไฟล์แรก
                </Button>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow className="hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-700 bg-gray-50">ลำดับ</TableHead>
                        <TableHead className="font-semibold text-gray-700 bg-gray-50">วันที่สร้าง</TableHead>
                        <TableHead className="font-semibold text-gray-700 bg-gray-50">ชื่อไฟล์</TableHead>
                        <TableHead className="font-semibold text-gray-700 bg-gray-50">จำนวนเบอร์</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center bg-gray-50">การจัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {files.map((file, idx) => (
                        <TableRow 
                          key={file.name}
                          className="hover:bg-blue-50/50 transition-colors duration-200"
                        >
                          <TableCell>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {idx + 1}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                              {file.createAt}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-blue-500" />
                              <span className="font-medium text-gray-900">{file.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {file.count.toLocaleString()} เบอร์
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              onClick={() => handleDelete(file.name)}
                              variant="destructive"
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
    </div>
  );
}
