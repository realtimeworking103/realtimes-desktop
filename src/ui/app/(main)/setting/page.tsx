"use client";

import { useEffect, useState } from "react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";
import { toast } from "sonner";

export default function Page() {
  const [ldplayerPath, setLdplayerPath] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    window.electron.getLDPlayerPath().then((path) => {
      if (!path) {
        setShowDialog(true);
      } else {
        setLdplayerPath(path);
      }
    });
  }, []);

  const handleSave = async () => {
    if (!ldplayerPath.toLowerCase().endsWith("ldconsole.exe")) {
      toast.error("กรุณาเลือกไฟล์ ldconsole.exe ให้ถูกต้อง");
      return;
    }

    await window.electron.setLDPlayerPath(ldplayerPath);
    setShowDialog(false);
    toast.success("บันทึก PATH LDPlayer เรียบร้อยแล้ว");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Setting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full space-x-3">
            <Input
              type="text"
              placeholder="PATH LDPlayer"
              value={ldplayerPath}
              onChange={(e) => setLdplayerPath(e.target.value)}
            />
            <Button onClick={handleSave}>บันทึก</Button>
          </div>
        </CardContent>
      </Card>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[400px] space-y-4 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">กรุณาใส่ PATH LDPlayer</h2>
            <Input
              placeholder="C:\\LDPlayer\\ldconsole.exe"
              value={ldplayerPath}
              onChange={(e) => setLdplayerPath(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button onClick={handleSave}>บันทึก</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
