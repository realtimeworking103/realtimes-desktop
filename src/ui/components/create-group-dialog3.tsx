import React, { useEffect, useState } from "react";

import { AccountType, NameGroupType, ProfileType } from "@/ui/types/types";

import { Button } from "./ui/button";

import { Card, CardTitle, CardHeader, CardContent } from "./ui/card";

import { DialogFooter } from "./ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Switch } from "./ui/switch";

interface CreateGroupDialogProps {
  onConfirm: (
    nameGroup: string,
    profile: string,
    officalAccount: string,
    privateAccount: string,
  ) => void;
  onCancel: () => void;
}

export const CreateGroupDialog3: React.FC<CreateGroupDialogProps> = ({
  onConfirm,
  onCancel,
}) => {
  const [nameGroup, setNameGroup] = useState<NameGroupType[]>([]);
  const [profile, setProfile] = useState<ProfileType[]>([]);
  const [selectedNameGroup, setSelectedNameGroup] = useState<string>("");
  const [selectedProfile, setSelectedProfile] = useState<ProfileType>();
  const [officalAccount, setOfficalAccount] = useState<AccountType[]>([]);
  const [privateAccount, setPrivateAccount] = useState<AccountType[]>([]);
  const [selectedOffAccount, setSelectedOffAccount] = useState<string>("");
  const [selectedPrivateAccount, setSelectedPrivateAccount] =
    useState<string>("");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    window.electron.getFileNameGroup().then((data) => {
      setNameGroup(data);
    });
  }, []);

  useEffect(() => {
    window.electron.getProfile().then((data) => {
      setProfile(data);
    });
  }, []);

  useEffect(() => {
    if (nameGroup.length > 0) {
      setSelectedNameGroup(
        nameGroup[Math.floor(Math.random() * nameGroup.length)].name,
      );
    }
  }, [nameGroup]);

  useEffect(() => {
    if (profile.length > 0) {
      setSelectedProfile(profile[Math.floor(Math.random() * profile.length)]);
    }
  }, [profile]);

  useEffect(() => {
    if (enabled) {
      window.electron.getAccount().then((data) => {
        setOfficalAccount(data.filter((item) => item.type === "ไลน์บอท"));
        setPrivateAccount(data.filter((item) => item.type === "ไลน์ส่วนตัว"));
      });
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      handleRandomOffAccount();
      handleRandomPrivateAccount();
    } else {
      setSelectedOffAccount("");
      setSelectedPrivateAccount("");
    }
  }, [enabled, officalAccount, privateAccount]);

  const handleRandomNameGroup = () => {
    const randomNameGroup =
      nameGroup[Math.floor(Math.random() * nameGroup.length)].name;
    setSelectedNameGroup(randomNameGroup);
  };

  const handleRandomProfile = () => {
    const randomProfile = profile[Math.floor(Math.random() * profile.length)];
    setSelectedProfile(randomProfile);
  };

  const handleSelectNameGroup = (value: string) => {
    if (value === "random") {
      handleRandomNameGroup();
    } else {
      setSelectedNameGroup(value);
    }
  };

  const handleSelectProfile = (value: string) => {
    if (value === "random") {
      handleRandomProfile();
    } else {
      setSelectedProfile(profile.find((item) => item.path === value));
    }
  };

  const handleRandomOffAccount = () => {
    if (officalAccount.length > 0) {
      const randomOffAccount =
        officalAccount[Math.floor(Math.random() * officalAccount.length)].name;
      setSelectedOffAccount(randomOffAccount);
    }
  };

  const handleRandomPrivateAccount = () => {
    if (privateAccount.length > 0) {
      const randomPrivateAccount =
        privateAccount[Math.floor(Math.random() * privateAccount.length)].name;
      setSelectedPrivateAccount(randomPrivateAccount);
    }
  };

  const handleSelectOffAccount = (value: string) => {
    setSelectedOffAccount(value);
  };

  const handleSelectPrivateAccount = (value: string) => {
    setSelectedPrivateAccount(value);
  };

  const handleConfirm = () => {
    onConfirm(
      selectedNameGroup,
      selectedProfile?.path || "",
      selectedOffAccount,
      selectedPrivateAccount,
    );
    onCancel();
  };

  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardHeader>
          <CardTitle>ชื่อกลุ่ม</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedNameGroup}
            onValueChange={handleSelectNameGroup}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="เลือกชื่อกลุ่ม" />
            </SelectTrigger>
            <SelectContent>
              {nameGroup.map((item) => (
                <SelectItem key={item.name} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
              <SelectItem value="random">สุ่มชื่อกลุ่ม</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>โปรไฟล์</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="flex h-30 flex-wrap gap-2 overflow-x-auto">
            {profile.map((item) => (
              <img
                key={item.path}
                src={`file://${item.path.replace(/\\/g, "/")}`}
                alt="profile"
                className={`h-28 w-28 cursor-pointer ${
                  selectedProfile?.path === item.path
                    ? "border-2 border-blue-500"
                    : ""
                }`}
                onClick={() => handleSelectProfile(item.path)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between">
            บัญชีไลน์
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center justify-between gap-2">
            <Select
              disabled={!enabled}
              value={selectedOffAccount}
              onValueChange={handleSelectOffAccount}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกบัญชีไลน์" />
              </SelectTrigger>
              <SelectContent>
                {officalAccount.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              disabled={!enabled}
              value={selectedPrivateAccount}
              onValueChange={handleSelectPrivateAccount}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกบัญชีไลน์" />
              </SelectTrigger>
              <SelectContent>
                {privateAccount.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>ข้อความ</CardTitle>
        </CardHeader>
        <CardContent>
          <Select disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="ยังไม่เปิดให้ใช้งาน" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ยังไม่เปิดให้ใช้งาน">
                ยังไม่เปิดให้ใช้งาน
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <DialogFooter>
        <Button className="w-full" onClick={handleConfirm}>
          สร้างกลุ่ม
        </Button>
      </DialogFooter>
    </div>
  );
};
