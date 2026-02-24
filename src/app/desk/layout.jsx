import SidePanel from "@/components/desk-components/side-navigation-panels";
import CoverNotebook from "@/components/desk-components/books/notebook-cover";
import BookShelf from "@/components/desk-components/books/book-shelf";
import Account from "@/components/desk-components/account";
import Notes from "@/components/desk-components/notes/notes";

const DeskLayout = ({ children }) => {
  "use client";
  return (
    <div className="flex h-screen w-full">
      <div className="w-2/10">
        <SidePanel label="Notebooks">
          <CoverNotebook title="title" />
          <BookShelf />
          <div className="mt-auto">
            <Account />
          </div>
        </SidePanel>
      </div>

      <main className="w-3/5">{children}</main>
      <div className="ml-auto w-1/5">
        <SidePanel label="Notes">
          <Notes />
        </SidePanel>
      </div>
    </div>
  );
};

export default DeskLayout;
