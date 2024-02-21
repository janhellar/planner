import { PersistentStorage } from "./PersistentStorage";

export default class RemoteStorage extends PersistentStorage {
  constructor() {
    super();
  }

  protected saveRemote() {
    const data = this.getData();
    const password = localStorage.getItem("password");
    const serverUrl = localStorage.getItem("server-url");

    fetch(`https://${serverUrl}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Basic ${window.btoa(`user:${password}`)}`,
      },
      body: data,
    });
  }

  protected async loadRemote() {
    const password = localStorage.getItem("password");
    const serverUrl = localStorage.getItem("server-url");

    const response = await fetch(`https://${serverUrl}/load`, {
      headers: {
        Authorization: `Basic ${window.btoa(`user:${password}`)}`,
      },
    });
    const json = await response.text();

    this.setData(json);
  }
}
