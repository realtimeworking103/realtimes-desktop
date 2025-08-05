import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";
import {
  AccountType,
  MessageType,
  NameGroupType,
  ProfileType,
} from "@/ui/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardTitle, CardHeader, CardContent } from "./ui/card";

interface InviteChatDialogProps {
  open: boolean;
  onConfirm: (
    nameGroup: string,
    profile: string,
    officialId: string[],
    privateId: string[],
    message: string,
  ) => void;
  onCancel: () => void;
}

export const InviteChatDialog: React.FC<InviteChatDialogProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  const [nameGroup, setNameGroup] = useState<NameGroupType[]>([]);
  const [selectedNameGroup, setSelectedNameGroup] = useState<string>("");
  const [profile, setProfile] = useState<ProfileType[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string>("");
  const [selectedProfilePaths, setSelectedProfilePaths] = useState<string[]>(
    [],
  );
  const [account, setAccount] = useState<AccountType[]>([]);
  const [officialId, setOfficialId] = useState<string[]>([]);
  const [privateId, setPrivateId] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<MessageType[]>([]);
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
    window.electron.getAccount().then((data) => {
      setAccount(data);
    });
  }, []);

  useEffect(() => {
    window.electron.getMessage().then((data) => {
      setMessageList(data as unknown as MessageType[]);
    });
  }, []);

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
      setSelectedProfiles(value);
      setSelectedProfilePaths([
        profile.find((profile) => profile.name === value)?.path || "",
      ]);
    }
  };

  const handleSelectOfficialId = (value: string) => {
    setOfficialId([...officialId, value]);
  };

  const handleSelectPrivateId = (value: string) => {
    setPrivateId([...privateId, value]);
  };

  const handleRandomNameGroup = () => {
    const randomNameGroup =
      nameGroup[Math.floor(Math.random() * nameGroup.length)].name;
    setSelectedNameGroup(randomNameGroup);
  };

  const handleRandomProfile = () => {
    const randomProfile = profile[Math.floor(Math.random() * profile.length)];
    setSelectedProfilePaths([randomProfile.path]);
  };

  const clearAll = () => {
    setSelectedNameGroup(
      nameGroup[Math.floor(Math.random() * nameGroup.length)].name,
    );
    setSelectedProfilePaths([
      profile[Math.floor(Math.random() * profile.length)].path,
    ]);
    setOfficialId([]);
    setPrivateId([]);
  };

  const handleConfirm = () => {
    onConfirm(
      selectedNameGroup,
      selectedProfilePaths[0],
      officialId,
      privateId,
      selectedMessage,
    );
    clearAll();
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
            <Select
              onValueChange={handleSelectNameGroup}
              defaultValue={selectedNameGroup}
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
            <Select
              onValueChange={handleSelectProfile}
              defaultValue={selectedProfiles}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกโปรไฟล์" />
              </SelectTrigger>
              <SelectContent>
                {profile.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
                <SelectItem value="random" onClick={handleRandomProfile}>
                  สุ่มโปรไฟล์
                </SelectItem>
              </SelectContent>
            </Select>
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
        <Card>
          <CardHeader>
            <CardTitle>ข้อความ</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              onValueChange={(value) => setSelectedMessage(value)}
              defaultValue={selectedMessage}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกข้อความ" />
              </SelectTrigger>
              <SelectContent>
                {messageList.map((item) => (
                  <SelectItem key={item.id} value={item.nameMessage}>
                    {item.nameMessage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
