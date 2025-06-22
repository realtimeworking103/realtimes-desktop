import { LDPlayerType } from "@/ui/types/types";

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
    } catch (err) {
      console.error("Open LDPlayer Fail:", err);
    }
  };

  const handleDeleteLDPlayer = async () => {
    try {
      await Promise.all(
        getSelectedNames().map((ldName) =>
          window.electron.deleteLdInstance(ldName),
        ),
      );
      await fetchLDPlayers();
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
      setSelectedRows((prev) => {
        const updated = new Set(prev);
        names.forEach((n) => updated.delete(n));
        return updated;
      });
      await fetchLDPlayers();
    } catch (err) {
      console.error("Delete Row Fail:", err);
    }
  };

  const handleGetTokenAuto = async () => {
    try {
      await Promise.all(
        getSelectedNames().map((ldName) =>
          window.electron.pullDBLdInstanceAuto(ldName),
        ),
      );
      await fetchLDPlayers();
    } catch (err) {
      console.error("Get Token Auto Fail:", err);
    }
  };

  const handleGetTokenManual = async () => {
    try {
      await Promise.all(
        getSelectedNames().map((ldName) =>
          window.electron.pullDBLdInstanceManual(ldName),
        ),
      );
    } catch (err) {
      console.error("Get Token Manual Fail:", err);
    }
  };

  const handleCreateGroup = async () => {
    const toCreate = ldplayers
      .filter((p) => selectedRows.has(p.LDPlayerGridLD))
      .map((p) => ({
        name: p.LDPlayerGridLD,
        token: p.TokenGridLD,
      }));

    if (toCreate.length === 0) {
      console.warn("ยังไม่ได้เลือก LDPlayer สำหรับสร้างกลุ่ม");
      return;
    }

    try {
      await Promise.all(
        toCreate.map(({ name, token }) =>
          window.electron.createGroup({ ldName: name, accessToken: token }),
        ),
      );
      await fetchLDPlayers();
    } catch (err) {
      console.error("Create Group Fail:", err);
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
      await fetchLDPlayers();
    } catch (err) {
      console.error("Check Ban Failed:", err);
    }
  };

  return {
    handleOpenLDPlayer,
    handleDeleteLDPlayer,
    handleDeleteRow,
    handleGetTokenAuto,
    handleGetTokenManual,
    handleCreateGroup,
    handleCheckban,
  };
}
