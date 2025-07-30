import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";
import { AccountType, NameGroupType, ProfileType } from "@/ui/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardTitle, CardHeader, CardContent } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface CreateGroupDialogProps {
  open: boolean;
  onConfirm: (
    nameGroup: string,
    profile: string,
    officialId: string[],
    privateId: string[],
  ) => void;
  onCancel: () => void;
}

export const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  const [nameGroup, setNameGroup] = useState<NameGroupType[]>([]);
  const [selectedNameGroup, setSelectedNameGroup] = useState<string>("");

  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [selectedProfilePaths, setSelectedProfilePaths] = useState<string[]>(
    [],
  );

  const [account, setAccount] = useState<AccountType[]>([]);
  const [officialId, setOfficialId] = useState<string[]>([]);
  const [privateId, setPrivateId] = useState<string[]>([]);
  const [allProfile, setAllProfile] = useState<ProfileType[]>([]);

  useEffect(() => {
    window.electron.getFileNameGroup().then((data) => {
      setNameGroup(data);
    });
  }, []);

  useEffect(() => {
    window.electron.getProfile().then((data) => {
      setAllProfile(data);
    });
  }, []);

  useEffect(() => {
    window.electron.getAccount().then((data) => {
      setAccount(data);
    });
  }, []);

  const handleSelectNameGroup = (value: string) => {
    setSelectedNameGroup(value);
  };

  const handleSelectOfficialId = (value: string) => {
    setOfficialId([...officialId, value]);
  };

  const handleSelectPrivateId = (value: string) => {
    setPrivateId([...privateId, value]);
  };

  const handleConfirm = () => {
    onConfirm(
      selectedNameGroup,
      selectedProfilePaths[0],
      officialId,
      privateId,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-md p-4 select-none">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            สร้างกลุ่ม
          </DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>ชื่อกลุ่ม</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleSelectNameGroup}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกชื่อกลุ่ม" />
              </SelectTrigger>
              <SelectContent>
                {nameGroup.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>โปรไฟล์</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center overflow-x-auto">
              {allProfile.map((profile, idx) => (
                <img
                  key={idx}
                  src={`/profile/${profile.name}`}
                  alt="profile"
                  className={
                    " mx-1 h-16 w-16 cursor-pointer hover:ring-2 hover:ring-blue-500" +
                    (selectedProfiles.includes(profile.name)
                      ? " ring-4 ring-green-500"
                      : "")
                  }
                  onClick={() => {
                    if (!selectedProfiles.includes(profile.name)) {
                      setSelectedProfiles([...selectedProfiles, profile.name]);
                      setSelectedProfilePaths([
                        ...selectedProfilePaths,
                        profile.path,
                      ]);
                    } else {
                      setSelectedProfiles(
                        selectedProfiles.filter((n) => n !== profile.name),
                      );
                      setSelectedProfilePaths(
                        selectedProfilePaths.filter((p) => p !== profile.path),
                      );
                    }
                  }}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center">
              <RadioGroup
                className="flex items-center justify-center"
                value={selectedProfiles.length === 1 ? "CUSTOM" : "SYSTEM"}
              >
                <RadioGroupItem
                  value="CUSTOM"
                  checked={selectedProfiles.length === 1}
                  onClick={() => {
                    setSelectedProfiles([allProfile[0].name]);
                    setSelectedProfilePaths([allProfile[0].path]);
                  }}
                >
                  สุ่มรูปภาพ
                </RadioGroupItem>
                <Label>สุ่มรูปภาพ</Label>
                <RadioGroupItem
                  value="SYSTEM"
                  checked={selectedProfiles.length === 0}
                  onClick={() => {
                    setSelectedProfiles([]);
                    setSelectedProfilePaths([]);
                  }}
                >
                  เลือกรูปภาพจากระบบ
                </RadioGroupItem>
                <Label>เลือกรูปภาพจากระบบ</Label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>บัญชีไลน์</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Select onValueChange={handleSelectOfficialId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกบัญชีไลน์" />
                </SelectTrigger>
                <SelectContent>
                  {account
                    .filter((item) => item.type === "ไลน์บอท")
                    .map((item) => (
                      <SelectItem key={item.name} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select onValueChange={handleSelectPrivateId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกบัญชีไลน์" />
                </SelectTrigger>
                <SelectContent>
                  {account
                    .filter((item) => item.type === "ไลน์ส่วนตัว")
                    .map((item) => (
                      <SelectItem key={item.name} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <DialogFooter>
          <Button className="w-full" onClick={handleConfirm}>
            สร้างกลุ่ม
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
