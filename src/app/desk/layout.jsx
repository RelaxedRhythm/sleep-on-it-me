import SidePanel from "@/components/desk-components/side-navigation-panels";
import CoverNotebook from "@/components/desk-components/books/notebook-cover";
import BookShelf from "@/components/desk-components/books/book-shelf";
import Account from "@/components/desk-components/account";

const DeskLayout = ({ children }) => {
  const handleBooksAdd = () => {
    console.log(books);
  };
  return (
    <div className="flex h-screen">
      <div className="w-1/6">
        <SidePanel label="Notebooks">
          <CoverNotebook title="title" />

          <BookShelf />
          <div className="mt-auto">
            <Account />
          </div>
        </SidePanel>
      </div>

      <main className="w-5/6">{children}</main>
    </div>
  );
};

export default DeskLayout;
