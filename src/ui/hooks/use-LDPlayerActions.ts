import { LDPlayerType } from "@/ui/types/types";
import { Semaphore } from "async-mutex";

export function useLDPlayerActions(
  selectedRows: Set<string>,
  ldplayers: LDPlayerType[],
  fetchLDPlayers: () => Promise<void>,
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>,
) {
  const getSelectedNames = () => Array.from(selectedRows);

  const handleOpenLDPlayer = async () => {
    try {
      await Promise.all(
        getSelectedNames().map((ldName) =>
          window.electron.callLdInstance(ldName),
        ),
      );
      fetchLDPlayers();
    } catch (err) {
      console.error("Open LDPlayer Fail:", err);
    }
  };

  const handleDeleteLDPlayer = async () => {
    try {
      const semaphore = new Semaphore(1);
      await Promise.all(
        getSelectedNames().map(async (ldName) => {
          try {
            const [_, release] = await semaphore.acquire();
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await window.electron.deleteLdInstance(ldName);
            fetchLDPlayers();
            release();
          } catch (err) {
            console.error("Delete LDPlayer Fail:", err);
          }
        }),
      );
      fetchLDPlayers();
    } catch (err) {
      console.error("Delete LDPlayer Fail:", err);
    }
  };

  const handleDeleteRow = async () => {
    const names = getSelectedNames();

    try {
      await Promise.all(
        names.map((ldName) => window.electron.deleteRowFromDB(ldName)),
      );
      fetchLDPlayers();
      setSelectedRows((prev) => {
        const updated = new Set(prev);
        names.forEach((n) => updated.delete(n));
        return updated;
      });
    } catch (err) {
      console.error("Delete Row Fail:", err);
    }
  };

  const handleGetTokenAuto = async () => {
    try {
      const semaphore = new Semaphore(3);
      await Promise.all(
        getSelectedNames().map(async (ldName) => {
          try {
            const [_, release] = await semaphore.acquire();
            await window.electron.getTokenLdInstance(ldName);
            fetchLDPlayers();
            release();
          } catch (err) {
            console.error("Get Token Auto Fail:", err);
          }
        }),
      );
      fetchLDPlayers();
    } catch (err) {
      console.error("Get Token Auto Fail:", err);
    }
  };

  const handleCheckban = async () => {
    const toCheckban = ldplayers
      .filter((p) => selectedRows.has(p.LDPlayerGridLD))
      .map((p) => ({
        ldName: p.LDPlayerGridLD,
        accessToken: p.TokenGridLD,
      }));

    if (toCheckban.length === 0) {
      console.warn("กรุณาเลือก LDPlayer ที่ต้องการตรวจสอบก่อน");
      return;
    }

    try {
      await Promise.all(
        toCheckban.map((item) => window.electron.checkBanLdInstance(item)),
      );
      fetchLDPlayers();
    } catch (err) {
      console.error("Check Ban Failed:", err);
    }
  };

  const handleSelectFile = async (ldNames: string[], fileName: string) => {
    await Promise.all(
      ldNames.map((ldName) =>
        window.electron.updatePhoneFile({ ldName, fileName }),
      ),
    );
    fetchLDPlayers();
  };

  return {
    handleOpenLDPlayer,
    handleDeleteLDPlayer,
    handleDeleteRow,
    handleGetTokenAuto,
    handleCheckban,
    handleSelectFile,
  };
}
