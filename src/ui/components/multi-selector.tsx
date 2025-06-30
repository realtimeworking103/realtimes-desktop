"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Badge } from "@/ui/components/ui/badge";
import { Button } from "@/ui/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/components/ui/popover";

import { cn } from "../lib/utils";

export default function MultiSelector({
  options,
  selected,
  setSelected,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [open, setOpen] = useState(false);

  const toggleFramework = (framework: string) => {
    setSelected((prev) =>
      prev.includes(framework)
        ? prev.filter((f) => f !== framework)
        : [...prev, framework],
    );
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-2">
      {/* Multi-Select Combobox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selected.length > 0
              ? `${selected.length} framework${selected.length > 1 ? "s" : ""} selected`
              : "Select frameworks..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search frameworks..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {options.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={() => toggleFramework(framework.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(framework.value)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((framework) => {
            const frameworkData = options.find((f) => f.value === framework);
            return (
              <Badge key={framework} variant="secondary">
                {frameworkData?.label}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
