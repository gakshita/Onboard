// import dynamic from "next/dynamic";
"use client";
import Interests from "~/components/interests";

const InterestsPage: React.FC = () => {
  return <Interests />;
};
export default InterestsPage;
// export default dynamic(() => Promise.resolve(InterestsPage), { ssr: false });
