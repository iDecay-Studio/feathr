import {app} from "@leaf/shared/utils/core/app.js";
import {discardPrompt, savePrompt} from "@leaf/shared/utils/ui/prompts.js";
import {readTextFile, stat, writeFile} from "@tauri-apps/plugin-fs";
import {ask as askDialog, message, open as openDialog, save as saveDialog} from "@tauri-apps/plugin-dialog";
import {open as openWithDefault} from "@tauri-apps/plugin-shell";
import {clamp, getFileNameFromPath, inApp} from "@leaf/shared/utils/core/utils.js";
import {nodeOpenWithDialog, nodeSave, nodeSaveAs} from "@leaf/shared/utils/editor/file-node.js";

const dialogOpenFilters = [
  // {name: 'Text Documents', extensions: ['txt', 'md', 'json', 'yml', 'log']},
  {name: 'All Files', extensions: ['*']},
];
const dialogSaveFilters = [
  {name: 'Text Document', extensions: ['txt']},
  {name: 'All Files', extensions: ['*']},
];

export class File {
  path = ""; //the current file path
  index = 0; //the file index when switching between the recent files. Shouldn't become greater than 0.
  startSize = 0 //the initial file size
  
  init = async () => {
    this.startSize = (await this.getStats())?.size ?? 0;

    //load any unsaved content
    let unsavedChanges = app.settings.unsavedChanges.storeVal();
    if (unsavedChanges !== "") app.editor.reset(unsavedChanges);
    
    //load previous file if it the setting for it is enabled
    // if (app.settings.loadLastFile.storeVal()) {
    //   let recentPaths = await app.settings.recentPaths.get();
    //   if (recentPaths.length !== 0) {
    //     let mostRecentPath = recentPaths[recentPaths.length-1];
    //     this.#openFile(mostRecentPath);
    //   }
    // }
  }

  update = async () => {
    this.updateTitle();

    if (this.path === "") return;
    
    let currSize = (await this.getStats())?.size ?? 0;
    let fileContent = await this.#read();
    if (!fileContent) return;
    
    if (fileContent !== app.editor.text() && (currSize !== this.size))
      askDialog("File was modified outside the app. Do you want to reload it?").then(async confirmed => {
        if (confirmed) app.editor.reset(fileContent);
        this.size = currSize;
      });
  }
  
  updateTitle = () => app.titleRef.innerText = this.#getTitle();
  #getTitle = () => {
    let suffix = app.editor.textEdited() ? "*" : "";
    if (!this.path) return 'New Document' + suffix;

    return getFileNameFromPath(this.path) + suffix;
  }

  new = () => savePrompt(this.#new);
  #new() {
    this.#close();
    app.update();
  }

  openWithDialog = (defPath = "") => savePrompt(() => this.#openWithDialog(defPath));
  #openWithDialog(defPath = "") {
    if (!inApp) return nodeOpenWithDialog();

    openDialog({
      defaultPath: defPath,
      filters: dialogOpenFilters,
    }).then(filePath => this.#open(filePath), this.#errorOpening);
  }
  
  open = (path = "") => savePrompt(() => this.#open(path));
  #open(path) {
    this.#close();
    readTextFile(path).then((text) => {
      this.path = path;
      app.editor.reset(text)
    }, this.#errorOpening);
  }

  openInExplorer = async () => {
    if (this.path !== "") await openWithDefault(this.path);
  };
  
  save = () => this.path === "" ? this.saveAs() : this.#save(this.path);
  #save(path, onSuccess = null) {
    if (!inApp) return nodeSave(path, onSuccess);

    return new Promise((success, failure) => {
      writeFile(path, app.editor.text()).then(() => {
        app.editor.startingState = app.editor.text();
        app.settings.unsavedChanges.set("");
        onSuccess && onSuccess();
        success();
      }, (reason) => {
        failure();
        this.#errorSaving(reason);
      });
    });
  }

  saveAs() {
    if (!inApp) return nodeSaveAs();
    
    return saveDialog({
      defaultPath: this.path,
      filters: dialogSaveFilters,
    }).then(path => this.#save(path, () => {
        this.path = path;
        app.update();
      }), this.#errorSaving);
  }

  discardChanges = () => discardPrompt(this.#discardChanges);
  #discardChanges = () => app.editor.reset(app.editor.startingState);

  #close() {
    app.editor.reset();
    //add this.path to recentPaths if not empty before clearing it
    if (this.path !== "") app.settings.recentPaths.add(this.path);
    this.path = "";
  }

  prev = () => this.#openRecent(this.index - 1);
  next = () => this.#openRecent(this.index + 1);
  #openRecent = async (id) => {
    let recentPaths = await app.settings.recentPaths.get();
    if (recentPaths.length <= 1) return;
    
    id = clamp(id, -recentPaths.length, 0);
    this.index = id;
    
    this.#open(recentPaths[recentPaths.length - id]);
  }
  
  #errorOpening = err => message("Error while opening file: " + err);
  #errorSaving = err => message("Error while saving file: " + err);
  
  getStats = async () => this.path !== "" ? await stat(this.path) : null;

  //read file-data at current path
  #read = async () => {
    try {
      return await readTextFile(this.path);
    } catch (err) {}

    return null;
  };
}