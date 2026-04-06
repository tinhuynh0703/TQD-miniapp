import { atom } from "jotai";
import { atomWithRefresh } from "jotai/utils";
import { getUserInfo } from "zmp-sdk";

export const userState = atomWithRefresh(async () => {
  try {
    const userInfo = await getUserInfo({
      avatarType: "normal",
    });
    return userInfo;
  } catch (e) {
    // Tránh crash toàn app nếu người dùng không cấp quyền.
    return {
      id: undefined,
      name: "Người dùng",
      avatar: "",
      error:
        (e as { message?: string })?.message ?? (e ? String(e) : "Unknown"),
    } as any;
  }
});

export const customTitleState = atom("");
