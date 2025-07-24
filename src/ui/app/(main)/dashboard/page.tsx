import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";
import { FileText, Gauge, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const [totalLDPlayerCount, setTotalLDPlayerCount] = useState<number>(0);
  const [totalFileCount, setTotalFileCount] = useState<number>(0);
  const [mockData, setMockData] = useState<{ name: string; value: number }[]>(
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      setTotalLDPlayerCount(10);
      setTotalFileCount(10);
      setMockData([
        {
          name: "จำนวนLDPlayer ทั้งหมด",
          value: 10,
        },
        {
          name: "จำนวนไฟล์ทั้งหมด",
          value: 10,
        },
      ]);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-svh p-6 select-none">
      {/* Header Section */}
      <div className="sticky top-0 z-20 mb-4 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Gauge className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              แดชบอร์ด
            </h1>
          </div>
        </div>
      </div>
      {/* Content Section */}
      <div className="flex w-full flex-col gap-4 p-4">
        <div className="flex flex-row gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>จำนวนLDPlayer ทั้งหมด</CardTitle>
              <CardDescription>จำนวนLDPlayer ทั้งหมด</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="h-8 w-8" />
                  <p className="text-2xl font-bold">{totalLDPlayerCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>จำนวนไฟล์ทั้งหมด</CardTitle>
              <CardDescription>จำนวนไฟล์ทั้งหมด</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8" />
                  <p className="text-2xl font-bold">{totalFileCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
