import axios from "axios";

export const login = async (
  username: string,
  password: string,
  hwid: string,
) => {
  const response = await axios.post<{
    result: {
      sessionId: string;
      userId: string;
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
  return response.data;
};

export const logout = async (sessionId: string, userId: string) => {
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
  return response.data;
};
