import app from "@leaf/shared/js/core/app.js";
import {default as allSynonyms} from "@leaf/shared/js/core/modules/synonyms.js";

export class Dictionary {
  vocabulary = [];
  synonyms = {};

  init() {
    this.#build_synonyms();
    this.update();
  }

  update = () => {
    this.vocabulary = [];
    const words = app.editor.text().split(/[^\w-]+/g);
    words.forEach(word => this.#add_word(word));
  };

  #add_word = (word) => {
    if (word.length < 4 || this.vocabulary.includes(word) || this.vocabulary.includes(word.toLowerCase())) return;
    this.vocabulary.push(word);
  };

  find_suggestions = (target) => this.#uniq(this.vocabulary.filter(item => item.toLowerCase().substring(0, target.length) === target.toLowerCase())).map(item => target.substring(0, 1) + item.substring(1));

  find_synonyms = (target) => {
    if (target.length < 4) return [];

    if (this.synonyms[target]) return this.#uniq(this.synonyms[target]);

    if (target[target.length - 1] === 's') {
      const singular = this.synonyms[target.substring(0, target.length - 1)];
      if (this.synonyms[singular]) return this.#uniq(this.synonyms[singular]);
    }

    return [];
  };

  #build_synonyms = () => {
    this.synonyms = allSynonyms;
    for (const targetWord in allSynonyms) {
      const synonyms = allSynonyms[targetWord];

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