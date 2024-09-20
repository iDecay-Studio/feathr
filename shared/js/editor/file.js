import app from "@feathr/shared/js/core/app.js";
import {discardPrompt} from "@feathr/shared/js/ui/prompts.js";
import {readTextFile, stat, writeTextFile} from "@tauri-apps/plugin-fs";
import {ask as askDialog, message, open as openDialog, save as saveDialog} from "@tauri-apps/plugin-dialog";
import {open as openWithDefault} from "@tauri-apps/plugin-shell";
import {clamp, getFileNameFromPath, inApp, isMobile, newDocument} from "@feathr/shared/js/core/utils.js";
import {nodeOpen, nodeOpenWithDialog, nodeSave, nodeSaveAs} from "@feathr/shared/js/editor/file-node.js";
import {setRecentFilesMenu} from "@feathr/shared/js/ui/menu.js";
import {get, writable} from "svelte/store";
import {desktopDir, sep} from "@tauri-apps/api/path";

const dialogOpenFilters = [
  // {name: 'Text Documents', extensions: ['txt', 'md', 'json', 'yml', 'log']},
  {name: 'All Files', extensions: ['*']},
];
const dialogSaveFilters = [
  {name: 'Text Document', extensions: ['txt']},
  {name: 'All Files', extensions: ['*']},
];

export class File {
  pathStore = writable(""); //path to the currently open file
  index = 0; //the file index when switching between the recent files. Shouldn't become greater than 0.
  startSize = 0 //the initial file size
  
  init = async () => {
    this.startSize = await this.#getSize();
    await setRecentFilesMenu();

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

    if (isMobile || !this.hasPath()) return;
    
    let currSize = await this.#getSize();
    let fileContent = await this.#read();
    if (!fileContent) return;
    
    if (fileContent !== app.editor.text() && (currSize !== this.size))
      askDialog("File was modified outside the app. Do you want to reload it?").then(async confirmed => {
        if (confirmed) app.editor.reset(fileContent);
        this.size = currSize;
      });
  }

  setPath = (path) => {
    app.settings.recentPaths.add(path !== "" ? path : this.getPath());
    this.pathStore.set(path);
    this.update();
  }
  getPath = () => get(this.pathStore);
  hasPath = () => this.getPath().trim() !== "";
  
  updateTitle = () => app.setTitle(this.getTitle());
  getTitle = (addSuffix = true) => {
    let suffix = addSuffix && app.editor.textEdited ? "*" : "";
    if (!this.hasPath()) return newDocument() + suffix;

    return getFileNameFromPath(this.getPath()) + suffix;
  }

  new = () => discardPrompt(() => this.#new());
  #new() {
    this.close();
    app.update();
  }

  openWithDialog = (defPath = "") => discardPrompt(() => this.#openWithDialog(defPath));
  #openWithDialog(defPath = "") {
    const onOpenSuccess = path => this.#open(path);
    const onOpenFail = reason => this.#errorOpening(reason);
    
    if (!inApp) return nodeOpenWithDialog(onOpenSuccess, onOpenFail);

    openDialog({
      defaultPath: defPath,
      filters: dialogOpenFilters,
    }).then(result => {
      if (typeof result === "string") onOpenSuccess(result);
      else if (result.path !== "") {
        this.size = result.size;
        onOpenSuccess(result.path);
      }
      // else onOpenFail("No files selected.", result);
    }, onOpenFail);
  }
  
  open = (path = "") => discardPrompt(() => this.#open(path));
  #open(path) {
    const onOpenSuccess = text => {
      if (!path.startsWith('blob')) this.setPath(path);
      this.#getStats().then(stats => {
        if (stats) this.size = stats.size;
        app.editor.reset(text)
      });
    }
    const onOpenFail = reason => this.#errorOpening(reason);
    
    this.close();
    
    if (inApp) readTextFile(path).then(text => onOpenSuccess(text), onOpenFail);
    else nodeOpen(path, onOpenSuccess, onOpenFail);
  }

  openInExplorer = async () => {
    if (inApp && this.hasPath()) {
      let dirPath = this.getPath().match(/(.*)[\/\\]/)[1] || '';
      await openWithDefault(dirPath);
    }
  };
  
  save = () => !this.hasPath() ? this.saveAs() : this.#save(this.getPath());
  #save(path, onSuccess = null) {
    const onSaveSuccess = (success) => {
      app.editor.startingState = app.editor.text();
      app.settings.unsavedChanges.reset();
      onSuccess && onSuccess();
      success();
    };
    const onSaveFail = (reason, failure) => {
      failure();
      this.#errorSaving(reason);
    };
    if (!inApp) return nodeSave(path, onSaveSuccess, onSaveFail);
    return new Promise((success, failure) =>
      writeTextFile(path, app.editor.text()).then(
        () => onSaveSuccess(success),
        reason => onSaveFail(reason, failure))
    );
  }

  async saveAs() {
    const onSaveSuccess = path => this.setPath(path);
    const onSaveFail = reason => this.#errorSaving(reason);
    
    let defPath = this.getPath();
    if (defPath === "" && inApp && !isMobile) defPath = (await desktopDir()) + sep() + newDocument();
    
    if (!inApp) return nodeSaveAs();
    return saveDialog({
      defaultPath: defPath,
      filters: dialogSaveFilters,
    }).then(path => path && this.#save(path, () => onSaveSuccess(path)), onSaveFail);
  }

  discardChanges = () => discardPrompt(this.#discardChanges);
  #discardChanges = () => app.editor.reset(app.editor.startingState);

  close() {
    this.setPath("");
    app.settings.unsavedChanges.reset();
    app.editor.reset();
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
  
  #errorOpening = err => this.#error('opening', err);
  #errorSaving = err => this.#error('saving', err);
  
  #error = (op, err) => {
    if (inApp) message(`Error while ${op} file: ${err}`);
    else console.error(`Error while ${op} file: ${err}`);
  }
  
  #getStats = async () => inApp && !isMobile && this.hasPath() ? await stat(this.getPath()) : null;
  #getSize = async () => (await this.#getStats())?.size ?? 0;

  //read file-data at current path
  #read = async () => {
    if (!inApp) return null;
    
    try {
      return await readTextFile(this.getPath());
    } catch (err) {}

    return null;
  };
}