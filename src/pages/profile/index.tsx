import { useState } from "react";
import { authorize, getAccessToken } from "zmp-sdk";
import { getPhoneNumber } from "zmp-sdk/apis";

const REGISTER_PHONE_API =
  "https://zaloschool.chuyendoisoquocgia.net/api/webhook/getPhoneNumberByMiniApp";

export default function ProfilePage() {
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerResult, setRegisterResult] = useState<unknown>(null);

  const registerUserInfo = async () => {
    setRegisterLoading(true);
    setRegisterError(null);
    setRegisterResult(null);

    try {
      await authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"],
      });

      const token = await getAccessToken();
      if (!token) {
        throw new Error(
          "getAccessToken() trả về rỗng. Kiểm tra Login Studio / authorize.",
        );
      }

      const phoneRes: any = await getPhoneNumber();
      const code = phoneRes?.token ?? phoneRes?.code ?? null;
      if (!code) {
        throw new Error(
          "getPhoneNumber() không có token/code. Kiểm tra quyền scope.userPhonenumber.",
        );
      }

      const res = await fetch(REGISTER_PHONE_API, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify({ token, code: String(code) }),
      });

      const text = await res.text();
      let body: unknown = text;
      try {
        body = JSON.parse(text);
      } catch {}

      if (!res.ok) {
        throw new Error(
          typeof body === "object" && body !== null && "message" in body
            ? String((body as { message?: string }).message)
            : `HTTP ${res.status}: ${text.slice(0, 200)}`,
        );
      }

      setRegisterResult(body);
    } catch (e) {
      setRegisterError(
        (e as { message?: string })?.message ?? (e ? String(e) : "Unknown"),
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto">
      <div className="text-base font-medium">Cá nhân</div>

      <button
        type="button"
        className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white"
        onClick={() => void registerUserInfo()}
        disabled={registerLoading}
      >
        {registerLoading ? "Đang đăng ký..." : "Đăng ký thông tin"}
      </button>

      <div className="mt-4 rounded-xl bg-white border border-black/5 p-3 min-h-[80px]">
        {registerError ? (
          <div className="text-sm text-red-600">{registerError}</div>
        ) : registerResult != null ? (
          <pre className="text-[11px] whitespace-pre-wrap break-words leading-relaxed text-foreground">
            {JSON.stringify(registerResult, null, 2)}
          </pre>
        ) : (
          <div className="text-sm text-disabled">
            Bấm đăng ký để gửi thông tin lên hệ thống.
          </div>
        )}
      </div>
    </div>
  );
}
