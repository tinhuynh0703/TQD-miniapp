import Section from "@/components/section";

const PLACEHOLDER_ITEMS = [
  {
    title: "Khám phá",
    description: "Thay nội dung danh sách tại đây cho ứng dụng của bạn.",
  },
  {
    title: "Mẫu thẻ",
    description: "Giữ layout và theme hiện tại, chỉnh sửa text và dữ liệu.",
  },
  {
    title: "Tiếp tục phát triển",
    description: "Thêm route, API và component mới trên nền tảng này.",
  },
];

export default function ExplorePage() {
  return (
    <div className="flex w-full flex-col space-y-4 py-4 px-0">
      {PLACEHOLDER_ITEMS.map((item) => (
        <Section key={item.title} isCard className="!px-4">
          <article className="space-y-1.5">
            <h2 className="text-base font-medium">{item.title}</h2>
            <p className="text-xs text-disabled leading-relaxed">
              {item.description}
            </p>
          </article>
        </Section>
      ))}
    </div>
  );
}
