import axios from "axios";
import { getWindowsSID } from "../../src/utils/getWindowsSid.js";

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const hwid = await getWindowsSID();
  try {
    const response = await axios.post<{
      result: {
        userId: string;
        sessionId: string;
        username: string;
        password: string;
        name: string;
        role: string;
        createdAt: {
          _seconds: number;
          _nanoseconds: number;
        };
        updatedAt: {
          _seconds: number;
          _nanoseconds: number;
        };
        hwid: string;
        lastLogin: {
          _seconds: number;
          _nanoseconds: number;
        };
        lastLogout: {
          _seconds: number;
          _nanoseconds: number;
        };
      };
    }>("https://loginuser-uakuk5afgq-as.a.run.app", {
      data: {
        username: username,
        password: password,
        hwid: hwid,
      },
    });
    return {
      userId: response.data.result.userId,
      sessionId: response.data.result.sessionId,
    };
  } catch (error) {
    console.log(error);
    return {
      userId: "",
      sessionId: "",
    };
  }
};

export const logout = async ({
  sessionId,
  userId,
}: {
  sessionId: string;
  userId: string;
}) => {
  try {
    const response = await axios.post<{
      result: {
        userId: string;
        sessionId: string;
      };
    }>("https://logoutuser-uakuk5afgq-as.a.run.app", {
      data: {
        sessionId: sessionId,
        userId: userId,
      },
    });
    return {
      userId: response.data.result.userId,
      sessionId: response.data.result.sessionId,
    };
  } catch (error) {
    console.log(error);
    return {
      userId: "",
      sessionId: "",
    };
  }
};
