import app from "@feathr/shared/js/core/app.js";
import {inApp} from "@feathr/shared/js/core/utils.js";

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
    //only import the large synonym-db if not in app or in a production-built web-app
    const allSynonyms = inApp || import.meta.env.PROD ? import("./synonyms.js").default : {};
    if (Object.keys(allSynonyms).length === 0) return;
    
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

  #uniq = (arr) => {
    const result = [];
    for (const id in arr) if (result.indexOf(arr[id]) === -1) result[result.length] = arr[id];
    
    return result;
  }
  
  #matchCase(arr, target) {
    let firstChar = target.substring(0, 1);
    let startsUppercase = firstChar === firstChar.toUpperCase();
    
    return startsUppercase ? arr.map(item => item.substring(0, 1).toUpperCase() + item.substring(1)) : arr;
  }
}