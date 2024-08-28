import {app} from "@desktop/utils/core/app.js";
import {inApp} from "@desktop/utils/core/utils.js";

export class Dictionary {
  init = async () => {
    this.vocabulary = [];
    this.synonyms = {};
    this.#build_synonyms();
    this.update();
  }

  add_word = (s) => {
    const word = s.toLowerCase().trim();
    const regex = /[^a-z]/gi;

    if (regex.test(word) || word.length < 4) return;
    this.vocabulary[this.vocabulary.length] = word;
  };

  find_suggestion = (str) => {
    const target = str.toLowerCase();

    for (const id in this.vocabulary) {
      if (this.vocabulary[id].substring(0, target.length) !== target) continue;
      return this.vocabulary[id];
    }
    return null;
  };

  find_synonym = (str) => {
    if (str.trim().length < 4) return;

    const target = str.toLowerCase();
    if (this.synonyms[target]) return this.#uniq(this.synonyms[target]);

    if (target[target.length - 1] === 's') {
      const singular = this.synonyms[target.substring(0, target.length - 1)];
      if (this.synonyms[singular]) return this.#uniq(this.synonyms[singular]);
    }

    return null;
  };

  update = () => {
    const words = app.editor.el.value.toLowerCase().split(/[^\w-]+/);
    for (const wordID in words) this.add_word(words[wordID]);
  };

  #build_synonyms = () => {
    //only import the synonym-db if not in a production-built web-app
    const allSynonyms = !inApp && import.meta.env.PROD ? import("./synonyms.js").default : {};
    if (Object.keys(allSynonyms).length === 0) return;
    
    this.synonyms = allSynonyms;
    for (const targetWord in allSynonyms) {
      const synonyms = allSynonyms[targetWord];
      this.add_word(targetWord);

      for (const wordID in synonyms) {
        const targetParent = synonyms[wordID];
        if (this.synonyms[targetParent] && this.synonyms[targetParent].constructor === Array)
          this.synonyms[targetParent][this.synonyms[targetParent].length] = targetWord;
        else this.synonyms[targetParent] = [targetWord];
      }
    }
  };

  #uniq = (a1) => {
    const a2 = [];
    for (const id in a1) if (a2.indexOf(a1[id]) === -1) a2[a2.length] = a1[id];
    return a2;
  }
}