const clearNumber = (num: number | string): string => {
  const numStr = num.toString();
  return numStr
    .replace(".", ",")
    .replace(/(,\d*?)0+$/, "$1")
    .replace(/,$/, "");
};

export default clearNumber;
