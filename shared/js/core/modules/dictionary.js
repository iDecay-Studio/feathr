import app from "@leaf/shared/js/core/app.js";
import {default as allSynonyms} from "@leaf/shared/js/core/modules/synonyms.js";

export class Dictionary {
  vocabulary = new Map();
  synonyms = {};

  init() {
    this.#build_synonyms();
    this.update();
  }

  update = () => {
    this.vocabulary = new Map();
    const words = app.editor.text().split(/[^\w-]+/g);
    words.forEach(word => this.#add_word(word));
  };

  #add_word = (word) => {
    word = word.toLowerCase();
    if (word.length < 4) return;
    
    //increment occurrence if the word was already added
    if (this.vocabulary.has(word)) this.vocabulary.set(word, this.vocabulary.get(word)+1);
    else this.vocabulary.set(word, 1);
  };

  find_suggestions = (target) => {
    let firstChar = target.substring(0, 1);
    target = target.toLowerCase();
    
    let sortedMap = new Map([...this.vocabulary.entries()].sort((a, b) => b[1] - a[1]));
    let keys = Array.from(sortedMap.keys());
    
    let result = keys.filter(item => item !== target && item.substring(0, target.length) === target);
    result = result.map(item => firstChar + item.substring(1));
    
    return this.#uniq(result);
  };

  find_synonyms = (target) => {
    let origTarget = target;
    target = target.toLowerCase();
    if (this.synonyms[target]) return this.#matchCase(this.#uniq(this.synonyms[target]), origTarget);

    if (target[target.length - 1] === 's') {
      const singular = this.synonyms[target.substring(0, target.length - 1)];
      if (this.synonyms[singular]) return this.#matchCase(this.#uniq(this.synonyms[singular]), origTarget);
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
  
  #matchCase(arr, target) {
    let firstChar = target.substring(0, 1);
    let startsUppercase = firstChar === firstChar.toUpperCase();
    return startsUppercase ? arr.map(item => item.substring(0, 1).toUpperCase() + item.substring(1)) : arr;
  }
}