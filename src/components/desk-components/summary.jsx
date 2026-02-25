import Image from "next/image";

const NotebookSummary = ({ childern }) => {
  return (
    <div className="flex gap-4 text-lg text-stone-700">
      <div className="min-h-60 w-full rounded-xl bg-stone-100 p-6">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it
      </div>
      <div className="relative h-60 min-w-90 overflow-hidden rounded-xl">
        <Image
          quality={100}
          src="/pomodoro-illustration.jpg"
          fill
          alt="Pomodoro illustration"
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default NotebookSummary;
