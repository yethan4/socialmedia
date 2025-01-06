import { Sidebar } from "../../components";
import { useParams } from "react-router-dom";
import { MyLikes } from "./components/MyLikes";
import { Options } from "./components/Options";
import { MyComments } from "./components/MyComments";

export const MyActivityPage = () => {
  const { section } = useParams();

  const renderComponent = () => {
    console.log("t")
    if (section === "likes") return <MyLikes />;
    else if (section === "comments") return <MyComments />;
    else return <Options />
  };

  return (
    <div className="flex h-full w-full pt-20 dark:bg-gray-900">
      <Sidebar />
      {renderComponent()}
    </div>
  )
}
