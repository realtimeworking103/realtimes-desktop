import * as React from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/components/ui/alert-dialog";
import { VersionData } from "@/ui/types/types";

interface VersionManagerProps {
  versionData: VersionData;
  onVersionDataChange: (newData: VersionData) => void;
}

export function VersionManager({
  versionData,
  onVersionDataChange,
}: VersionManagerProps) {
  const [newVersion, setNewVersion] = React.useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = React.useState(false);
  const [versionToRemove, setVersionToRemove] = React.useState("");

  const handleAddVersion = async () => {
    if (!newVersion.trim()) return;

    try {
      const success = await window.electron.addAvailableVersion(
        newVersion.trim(),
      );
      if (success) {
        const updatedData: VersionData = {
          ...versionData,
          availableVersions: [
            ...versionData.availableVersions,
            newVersion.trim(),
          ],
          lastUpdated: new Date().toISOString(),
        };
        onVersionDataChange(updatedData);
        setNewVersion("");
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adding version:", error);
    }
  };

  const handleRemoveVersion = async () => {
    if (!versionToRemove) return;

    try {
      const success =
        await window.electron.removeAvailableVersion(versionToRemove);
      if (success) {
        const updatedData: VersionData = {
          ...versionData,
          availableVersions: versionData.availableVersions.filter(
            (v) => v !== versionToRemove,
          ),
          lastUpdated: new Date().toISOString(),
        };
        onVersionDataChange(updatedData);
        setVersionToRemove("");
        setIsRemoveDialogOpen(false);
      }
    } catch (error) {
      console.error("Error removing version:", error);
    }
  };

  const openRemoveDialog = (version: string) => {
    setVersionToRemove(version);
    setIsRemoveDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Brand Management</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
              <DialogDescription>
                Enter the name of the new brand to add to the available brands
                list.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-version">Brand Name</Label>
                <Input
                  id="new-version"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  placeholder="Enter brand name..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddVersion();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddVersion} disabled={!newVersion.trim()}>
                <Save className="mr-2 h-4 w-4" />
                Add Brand
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        <Label>Available Brand</Label>
        <div className="grid max-h-60 grid-cols-2 gap-2 overflow-y-auto">
          {versionData.availableVersions.map((version) => (
            <div
              key={version}
              className="flex items-center justify-between rounded-lg border p-2"
            >
              <span
                className={
                  version === versionData.currentVersion
                    ? "font-semibold text-blue-600"
                    : ""
                }
              >
                {version}
                {version === versionData.currentVersion && " (Current)"}
              </span>
              {version !== versionData.currentVersion && (
                <AlertDialog
                  open={isRemoveDialogOpen && versionToRemove === version}
                  onOpenChange={(open) => {
                    if (!open) setIsRemoveDialogOpen(false);
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openRemoveDialog(version)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Brand</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove brand "{version}"?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRemoveVersion}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Last updated: {new Date(versionData.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}
