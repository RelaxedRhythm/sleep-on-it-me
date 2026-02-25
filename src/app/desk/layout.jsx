import SidePanel from "@/components/desk-components/side-navigation-panels";
import BookShelf from "@/components/desk-components/books/book-shelf";
import Account from "@/components/desk-components/account";
import Notes from "@/components/desk-components/notes/notes";

const DeskLayout = ({ children }) => {
  "use client";
  return (
    <div className="flex h-screen w-full">
      <div className="w-2/10">
        <SidePanel label="Active Notebook Title">
          <div className="relative h-60 w-full rounded-b-lg bg-purple-500 text-purple-50"></div>
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
