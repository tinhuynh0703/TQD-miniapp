import Section from "@/components/section";
import TransitionLink from "@/components/transition-link";
import SearchIcon from "@/components/icons/search";
import book from "@/static/book.svg";
import history from "@/static/history.svg";
import { To } from "react-router-dom";

function HomeSearchBar({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center rounded-full bg-white relative p-3 space-x-2 ${className ?? ""}`}
    >
      <SearchIcon className="h-5 w-5 absolute left-3 text-disabled" />
      <span className="text-sm text-disabled pl-8">Tìm kiếm...</span>
    </div>
  );
}

function QuickAction({
  to,
  icon,
  title,
  subtitle,
}: {
  to: To;
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <TransitionLink
      to={to}
      className="flex items-center gap-2 rounded-xl bg-white p-3"
    >
      <img src={icon} className="h-11 w-11" alt="" />
      <div className="flex flex-grow flex-col gap-1.5 self-stretch">
        <div className="text-base font-medium">{title}</div>
        <div className="text-xs text-disabled">{subtitle}</div>
      </div>
    </TransitionLink>
  );
}

export default function HomePage() {
  return (
    <>
      <HomeSearchBar className="mx-4" />
      <Section className="pt-4 pb-5 grid grid-cols-2 gap-3">
        <QuickAction
          to="/new"
          icon={book}
          title="Tạo mới"
          subtitle="Thêm nội dung"
        />
        <QuickAction
          to="/activity"
          icon={history}
          title="Hoạt động"
          subtitle="Gần đây"
        />
      </Section>
      <Section title="Gợi ý" isCard className="pb-6 space-y-2">
        <div className="grid gap-3">
          {["Mục mẫu 1", "Mục mẫu 2", "Mục mẫu 3"].map((label) => (
            <div
              key={label}
              className="rounded-lg border border-black/5 bg-background/80 px-3 py-3 text-sm"
            >
              {label}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
