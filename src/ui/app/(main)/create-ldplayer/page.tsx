import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";

export default function Page() {
  return (
    <div className="w-[700px]">
      <div className="flex  space-x-1.5">
        <Input type="prefix" placeholder="Prefix" className="w-[200px]" />
        <Button>ดำเนินการต่อ</Button>
      </div>
    </div>
  );
}