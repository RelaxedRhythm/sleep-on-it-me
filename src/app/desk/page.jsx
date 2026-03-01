import CornellNoteTaking from "@/components/desk-components/cornell-note";
import NotebookSummary from "@/components/desk-components/summary";
import Pomodoro from "@/components/desk-components/pomodoro";
import SidePanel from "@/components/desk-components/side-navigation-panels";
import Notes from "@/components/desk-components/notes/notes";
import BookShelf from "@/components/desk-components/books/book-shelf";
import Account from "@/components/desk-components/account";
import { fetchNotes, fetchUser } from "@/library/actions";

export const metadata = {
  title: "Desk",
  description: "The best productive environment for you! Built with caution.",
};

// const getBookNotes = async (selectedbook) => {
//   "use server";
//   const notes = await fetchNotes(selectedbook);
//   console.log(notes);
// };
const user = await fetchUser("08cf938e-3d7b-4175-93cb-2d537652d999");
const Desk = async () => {
  return (
    <div className="flex h-full">
      {/* books navigation */}
      <SidePanel label="Active Notebook Title">
        <div className="h-40 w-full rounded-b-lg bg-purple-500 text-purple-50"></div>
        <BookShelf userId={user.id} />
        <div className="mt-auto">
          <Account user={user.username} />
        </div>
      </SidePanel>

      {/* workarea */}
      <div className="space-y-4 px-6">
        <NotebookSummary />
        <div className="flex items-start justify-around">
          <CornellNoteTaking />
          <Pomodoro />
        </div>
      </div>

      {/* notes navigation */}
      <SidePanel label="Notes">
        <Notes />
      </SidePanel>
    </div>
  );
};

export default Desk;
