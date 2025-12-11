export const assignExistingKeys = (target: any, source: any): void => {
  if (!source || typeof source !== 'object') return;
  for (const key in target) {
    const val = source[key];
    if (val === undefined) continue;
    if (val && typeof val === 'object' && target[key] && typeof target[key] === 'object') {
      assignExistingKeys(target[key], val);
    } else {
      target[key] = val;
    }
  }
};

export const isStructuralMatch = (obj1: any, obj2: any): boolean => {
  const isComplex1 = typeof obj1 === 'object' && obj1 !== null;
  const isComplex2 = typeof obj2 === 'object' && obj2 !== null;
  if (isComplex1 !== isComplex2) {
    return false;
  }
  if (!isComplex1 && !isComplex2) {
    return true;
  }
  const isArray1 = Array.isArray(obj1);
  const isArray2 = Array.isArray(obj2);
  if (isArray1 !== isArray2) {
    return false;
  }
  if (isArray1 && isArray2) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!isStructuralMatch(obj1[i], obj2[i])) return false;
    }
    return true;
  }
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();
  if (keys1.join() !== keys2.join()) return false;
  for (const key of keys1) {
    if (!isStructuralMatch(obj1[key], obj2[key])) return false;
  }
  return true;
};
