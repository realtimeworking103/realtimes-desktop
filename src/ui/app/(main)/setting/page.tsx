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

export default function Page() {
  const [ldplayerPath, setLdplayerPath] = useState("");

  useEffect(() => {
    const path = window.electron.getLdInstancePath();
    setLdplayerPath(path as unknown as string);
  }, []);

  const handleBrowse = async () => {
    const result = await window.electron.browseLdInstancePath();
    if (result) {
      setLdplayerPath(ldplayerPath);
    }
  };

  return (
    <div className="min-h-svh p-6 select-none">
      <div className="sticky top-0 z-20 mb-4 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
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
            />
            <Button onClick={handleBrowse}>Browse</Button>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
