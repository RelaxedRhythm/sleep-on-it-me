import CornellNoteTaking from "@/components/desk-components/note-taking";
import NotebookSummary from "@/components/desk-components/summary";
import Pomodoro from "@/components/desk-components/pomodoro";
import SidePanel from "@/components/desk-components/side-navigation-panels";
import Notes from "@/components/desk-components/notes/notes";

export const metadata = {
  title: "Desk",
  description: "The best productive environment for you! Built with caution.",
};

const Desk = () => {
  return (
    <div className="flex">
      <div className="px-6">
        <NotebookSummary />
        <div className="flex items-start justify-around">
          <CornellNoteTaking />
          <Pomodoro />
        </div>
      </div>
      <div className="w-1/5">
        <SidePanel label="Notes">
          <Notes />
        </SidePanel>
      </div>
    </div>
  );
};

export default Desk;
