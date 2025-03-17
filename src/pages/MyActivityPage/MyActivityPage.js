import { useParams } from "react-router-dom";
import { MyLikes } from "./components/MyLikes";
import { Options } from "./components/Options";
import { MyComments } from "./components/MyComments";

export const MyActivityPage = () => {
  const { section } = useParams();

  const renderComponent = () => {
    if (section === "likes") return <MyLikes />;
    else if (section === "comments") return <MyComments />;
    else return <Options />
  };

  return (
    <>
      {renderComponent()}
    </>
  )
}
