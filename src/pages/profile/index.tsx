import { useEffect, useState } from "react";
import { authorize, getAccessToken, getUserInfo } from "zmp-sdk";
import { getPhoneNumber } from "zmp-sdk/apis";

/** Xin scope rồi lấy token — bắt buộc gọi authorize trước getAccessToken (Zalo từ 2026). */
const getMyToken = async () => {
  try {
    // BƯỚC QUAN TRỌNG NHẤT: Xin quyền trước khi lấy Token
    console.log("Đang xin quyền truy cập...");
    await authorize({
      scopes: ["scope.userInfo"],
    });

    // Sau khi authorize thành công, mới gọi lấy token
    const accessToken = await getAccessToken();

    if (accessToken) {
      console.log("--- COPY TOKEN NÀY VAO POSTMAN ---");
      console.log(accessToken);
      console.log("---------------------------------");
    } else {
      console.log(
        "Token vẫn null. Hãy kiểm tra trạng thái Login ở tab 'Phát triển'.",
      );
    }
  } catch (error) {
    console.error("Lỗi xác thực hoặc hệ thống:", error);
    // Nếu lỗi là 'User cancel', nghĩa là bạn cần nhấn 'Cho phép' trên màn hình Simulator
  }
};
type ZaloUserPayload = Record<string, any> & {
  accessToken: string | null;
};

export default function ProfilePage() {
  const [payload, setPayload] = useState<ZaloUserPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneResult, setPhoneResult] = useState<any>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const copyText = async (value: unknown, label: string) => {
    const text =
      typeof value === "string" ? value : JSON.stringify(value ?? {}, null, 2);
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopyMessage(`Đã copy ${label}`);
      setTimeout(() => setCopyMessage(null), 1500);
    } catch (e) {
      console.error("Không thể copy:", e);
      setCopyMessage("Copy thất bại. Hãy bấm giữ để chọn thủ công.");
      setTimeout(() => setCopyMessage(null), 1800);
    }
  };

  const getPhoneTokenAndInfo = async () => {
    setPhoneLoading(true);
    setPhoneError(null);
    setPhoneResult(null);

    try {
      // Quyền số điện thoại (Zalo 2026 vẫn yêu cầu xin trước khi lấy token)
      await authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"],
      });

      const phoneRes: any = await getPhoneNumber();
      // Theo doc zmp-sdk: getPhoneNumber() trả về `{ token }` (phone token) để exchange ở server.
      const code = phoneRes?.token ?? phoneRes?.code ?? null;
      if (!code) {
        throw new Error(
          "Không thấy trường `token`/`code` trong response của getPhoneNumber().",
        );
      }

      console.log("PHONE_TOKEN_CUA_BAN (code):", code);
      setPhoneResult({
        code,
        phoneResRaw: phoneRes,
      });
    } catch (e) {
      console.error("Lỗi lấy phone info:", e);
      setPhoneError(
        (e as { message?: string })?.message ?? (e ? String(e) : "Unknown"),
      );
    } finally {
      setPhoneLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await authorize({
          scopes: ["scope.userInfo", "scope.userPhonenumber"],
        }).catch(() => {
          // user từ chối hoặc lỗi môi trường — vẫn thử đọc userInfo/token
        });

        const [userInfo, accessToken] = await Promise.all([
          getUserInfo({ avatarType: "normal" }).catch(() => null),
          getAccessToken().catch(() => null),
        ]);

        const raw: any = userInfo ?? {};
        if (!cancelled) {
          setPayload({
            ...raw,
            accessToken: (accessToken as string | null) ?? null,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            (e as { message?: string })?.message ??
              (e ? String(e) : "Unknown error"),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const json = error
    ? { error, hint: "Hãy kiểm tra quyền truy cập thông tin người dùng." }
    : payload;

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="text-base font-medium">Thông tin Zalo người dùng</div>
        <div className="text-2xs text-disabled">
          {loading ? "loading..." : json ? "done" : "idle"}
        </div>
      </div>

      <button
        type="button"
        className="mt-3 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white"
        onClick={() => getMyToken()}
      >
        Thử cưỡng ép lấy token (authorize → getAccessToken)
      </button>

      <button
        type="button"
        className="mt-3 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white"
        onClick={() => void getPhoneTokenAndInfo()}
        disabled={phoneLoading}
      >
        {phoneLoading ? "Đang lấy phone token..." : "Lấy phone token (code) từ getPhoneNumber"}
      </button>

      <div className="mt-4 rounded-xl bg-white border border-black/5 p-3">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            className="rounded-md border border-black/10 px-2 py-1 text-xs"
            onClick={() => void copyText(json, "user payload")}
            disabled={loading}
          >
            Copy user payload
          </button>
        </div>
        {loading ? (
          <div className="text-sm text-disabled">Đang lấy dữ liệu...</div>
        ) : (
          <pre className="text-[11px] whitespace-pre-wrap break-words leading-relaxed text-foreground">
            {JSON.stringify(json, null, 2)}
          </pre>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-white border border-black/5 p-3">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            className="rounded-md border border-black/10 px-2 py-1 text-xs"
            onClick={() => void copyText(phoneError ?? phoneResult ?? "", "phone result")}
            disabled={!phoneError && !phoneResult}
          >
            Copy phone result
          </button>
        </div>
        {phoneError ? (
          <div className="text-sm text-red-600">{phoneError}</div>
        ) : phoneResult ? (
          <pre className="text-[11px] whitespace-pre-wrap break-words leading-relaxed text-foreground">
            {JSON.stringify(phoneResult, null, 2)}
          </pre>
        ) : (
          <div className="text-sm text-disabled">
            Chưa có kết quả phone info. Bấm nút bên trên để lấy.
          </div>
        )}
      </div>

      {copyMessage ? (
        <div className="mt-3 text-center text-xs text-disabled">{copyMessage}</div>
      ) : null}
    </div>
  );
}
