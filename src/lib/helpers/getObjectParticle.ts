/** 한글 단어의 마지막 글자 받침 유무를 유니코드 코드포인트로 계산해 목적격 조사(을/를)를 고른다 */
export const getObjectParticle = (word: string) => {
  const lastCharCode = word.charCodeAt(word.length - 1) - 0xac00;
  const hasBatchim = lastCharCode >= 0 && lastCharCode % 28 !== 0;
  return hasBatchim ? '을' : '를';
};
