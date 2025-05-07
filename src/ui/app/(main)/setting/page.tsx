import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";

export default function Page() {
  return (
    <div className="flex space-x-2">
      <Input
        className="max-w-full"
        type="path_ld"
        placeholder="ใส่ Path LDPlayer"
      />
      <Button type="submit">บันทึก</Button>
    </div>
  );
}
