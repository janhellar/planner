import { InboxItem, Project, Reference } from "entities";
import useItems from "hooks/useItems";
import useStorage from "hooks/useStorage";
import useStorageItem from "hooks/useStorageItem";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  INBOX_STORAGE_KEY,
  PROJECTS_STORAGE_KEY,
  REFERENCE_STORAGE_KEY,
} from "storageKeys";
import SelectionList from "./SelectionList";

export default function ReferenceDecide() {
  const navigate = useNavigate();

  const referenceStorage = useStorage<Reference>(REFERENCE_STORAGE_KEY);
  const inboxStorage = useStorage<InboxItem>(INBOX_STORAGE_KEY);
  const projectStorage = useStorage<Project>(PROJECTS_STORAGE_KEY);

  const params = useParams<{ id: string }>();

  const todoId = Number(params.id);

  const { item } = useStorageItem(inboxStorage, todoId);

  const { items: projects } = useItems(projectStorage);
  const { items: references } = useItems(referenceStorage);

  const createReference = () => {
    if (item) {
      const id = referenceStorage.create({
        title: item.title,
        notes: "",
      });

      inboxStorage.remove(item.id);

      navigate(`/references/${id}`);
    }
  };

  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [selectedReferences, setSelectedReferences] = useState<number[]>([]);

  const renderItem = (item: Project | Reference) => (
    <span className="is-block p-2">{item.title || <i>empty</i>}</span>
  );

  const addReference = () => {
    if (item) {
      const projectsToUpdate = selectedProjects.map((id) =>
        projects.find((project) => project.id === id)
      );

      const refenrecesToUpdate = selectedReferences.map((id) =>
        references.find((reference) => reference.id === id)
      );

      projectsToUpdate.forEach(
        (project) =>
          project &&
          projectStorage.update({
            ...project,
            notes: `${project.notes}\n${item.title}`,
          })
      );

      refenrecesToUpdate.forEach(
        (reference) =>
          reference &&
          referenceStorage.update({
            ...reference,
            notes: `${reference.notes}\n${item.title}`,
          })
      );

      inboxStorage.remove(item.id);

      navigate(`/`);
    }
  };

  if (!item) {
    return <></>;
  }

  return (
    <>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/inbox">Inbox</Link>
          </li>
          <li className="is-active">
            <Link to={`/inbox/${item.id}`}>Reference</Link>
          </li>
        </ul>
      </nav>
      <div className="block field is-grouped">
        <p className="control">
          <button
            className="button is-small is-light"
            onClick={createReference}
          >
            new
          </button>
        </p>
        <p className="control">
          <button
            className="button is-small is-light"
            disabled={
              selectedProjects.length === 0 && selectedReferences.length === 0
            }
            onClick={addReference}
          >
            add
          </button>
        </p>
      </div>
      <nav className="breadcrumb mt-4" aria-label="breadcrumbs">
        <ul>
          <li className="is-active">
            <Link to="/projects">Projects</Link>
          </li>
        </ul>
      </nav>
      <SelectionList
        shrink
        items={projects}
        selected={selectedProjects}
        onSelect={setSelectedProjects}
        renderItem={renderItem}
      />
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li className="is-active">
            <Link to="/references">References</Link>
          </li>
        </ul>
      </nav>
      <SelectionList
        shrink
        items={references}
        selected={selectedReferences}
        onSelect={setSelectedReferences}
        renderItem={renderItem}
      />
    </>
  );
}
