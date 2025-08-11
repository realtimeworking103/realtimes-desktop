import fs from 'fs';
import path from 'path';
import { app } from 'electron';

interface VersionData {
  currentVersion: string;
  availableVersions: string[];
  lastUpdated: string;
}

const VERSION_FILE_NAME = 'version-config.json';

export const getVersionFilePath = (): string => {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, VERSION_FILE_NAME);
};

export const getVersionData = (): VersionData => {
  try {
    const filePath = getVersionFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading version data:', error);
  }
  
  // Default version data if file doesn't exist or error occurs
  return {
    currentVersion: 'LUCKY',
    availableVersions: [
      'LUCKY',
      'PHAROAH',
      '4x4',
      'NEKO',
      'FRORIDA',
      'TAIPEI',
      'KOH889',
      'BOSTON',
      'ANDAMAN',
      'NAGOYA',
      'GENEVA',
      'GALICIA',
      'SYDNEY',
      'OSLO',
      'MADDIX',
      '4M',
      'BARCA',
      'YORU',
      'LUCKY GO',
      'GPS',
      '999M',
      'PABLO',
      'LUCIANA',
      'ANGEL',
      'MIRACLE'
    ],
    lastUpdated: new Date().toISOString()
  };
};

export const saveVersionData = (versionData: VersionData): boolean => {
  try {
    const filePath = getVersionFilePath();
    const data = JSON.stringify(versionData, null, 2);
    fs.writeFileSync(filePath, data, 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving version data:', error);
    return false;
  }
};

export const updateCurrentVersion = (version: string): boolean => {
  try {
    const currentData = getVersionData();
    const updatedData: VersionData = {
      ...currentData,
      currentVersion: version,
      lastUpdated: new Date().toISOString()
    };
    return saveVersionData(updatedData);
  } catch (error) {
    console.error('Error updating current version:', error);
    return false;
  }
};

export const addAvailableVersion = (version: string): boolean => {
  try {
    const currentData = getVersionData();
    if (!currentData.availableVersions.includes(version)) {
      const updatedData: VersionData = {
        ...currentData,
        availableVersions: [...currentData.availableVersions, version],
        lastUpdated: new Date().toISOString()
      };
      return saveVersionData(updatedData);
    }
    return true;
  } catch (error) {
    console.error('Error adding available version:', error);
    return false;
  }
};

export const removeAvailableVersion = (version: string): boolean => {
  try {
    const currentData = getVersionData();
    const updatedData: VersionData = {
      ...currentData,
      availableVersions: currentData.availableVersions.filter(v => v !== version),
      lastUpdated: new Date().toISOString()
    };
    return saveVersionData(updatedData);
  } catch (error) {
    console.error('Error removing available version:', error);
    return false;
  }
};
