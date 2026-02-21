import NoteTaking from "@/components/desk-components/note-taking";
import NotebookSummary from "@/components/desk-components/summary";
import Pomodoro from "@/components/desk-components/pomodoro";

export const metadata = {
  title: "Desk",
  description: "The best productive environment for you! Built with caution.",
};

const Desk = () => {
  return (
    <div className="px-6">
      <NotebookSummary />
      <div className="flex justify-around">
        <NoteTaking />
        <Pomodoro />
      </div>
    </div>
  );
};

export default Desk;
