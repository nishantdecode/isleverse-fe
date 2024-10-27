import CallComponent from "@/components/call-component";
import { VideoPlayer } from "@/components/video-call-app";

export default function Home() {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="flex flex-col lg:flex-row items-center w-full lg:w-2/3 h-[80vh] lg:h-1/2 p-5">
        <div className="h-1/3 lg:h-full w-full sm:max-w-md lg:max-w-full">
          <VideoPlayer isSelf />
        </div>
        <div className="min-w-[300px] w-full max-w-full sm:max-w-md h-1/3 lg:h-full">
          <CallComponent />
        </div>
      </div>
    </div>
  );
}
