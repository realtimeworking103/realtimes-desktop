"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";
import { Settings } from "lucide-react";
import { Input } from "@/ui/components/ui/input";
import { Button } from "@/ui/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { VersionManager } from "@/ui/components/version-manager";
import { VersionData } from "@/ui/types/types";

export default function Page() {
  const [ldplayerPath, setLdplayerPath] = useState("");
  const [versionData, setVersionData] = useState<VersionData | null>(null);

  useEffect(() => {
    fetchPath();
    fetchVersionData();
  }, []);

  const fetchVersionData = async () => {
    try {
      const data = await window.electron.getVersionData();
      setVersionData(data);
    } catch (error) {
      console.error("Error loading version data:", error);
    }
  };

  const fetchPath = async () => {
    const path = await window.electron.getLdInstancePath();
    setLdplayerPath(path);
  };

  const handleBrowse = async () => {
    const result = await window.electron.browseLdInstancePath();
    if (result) {
      setLdplayerPath(ldplayerPath);
      await fetchPath();
      toast.success("ตั้งค่า LDPlayer เรียบร้อย");
    }
  };

  return (
    <div className="min-h-svh p-6 select-none">
      <div className="sticky top-0 z-20 mb-4 border-b backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              ตั้งค่า
            </h1>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>ตั้งค่า LDPlayer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full space-x-3">
            <Input
              type="text"
              placeholder="LDPlayer Path"
              className="w-full"
              value={ldplayerPath}
              onChange={(e) => setLdplayerPath(e.target.value)}
              disabled={true}
            />
            <Button
              variant="default"
              onClick={handleBrowse}
              className="bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
            >
              เลือกไฟล์
            </Button>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      {/* Version Management */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Version Management</CardTitle>
        </CardHeader>
        <CardContent>
          {versionData ? (
            <VersionManager
              versionData={versionData}
              onVersionDataChange={setVersionData}
            />
          ) : (
            <div className="py-4 text-center">Loading version data...</div>
          )}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      {/* Tips */}
      <div className="mt-2 rounded bg-blue-50 px-6 py-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
        💡 <b>Tips:</b> กดปุ่ม <kbd>เลือกไฟล์</kbd> เพื่อเลือกไฟล์ LDPlayer
        ตัวอย่าง : C:\LDPlayer\LDPlayer9\ldconsole.exe
      </div>
    </div>
  );
}
