import { Project } from "entities";
import { PROJECTS_STORAGE_KEY } from "storageKeys";
import NextActions from "./NextActions";
import Calendar from "./Calendar";
import DetailPage from "./DetailPage";
import WaitingFor from "./WaitingFor";
import Habits from "./Habits";

export default function ProjectDetail() {
  return (
    <DetailPage<Project>
      heading="Projects"
      path="/projects"
      storageKey={PROJECTS_STORAGE_KEY}
      fields={[
        "title",
        "notes",
        "priority",
        (item) => (
          <>
            <NextActions projectId={item.id} />
            <Calendar projectId={item.id} />
            <WaitingFor projectId={item.id} />
            <Habits projectId={item.id} />
          </>
        ),
      ]}
    />
  );
}
