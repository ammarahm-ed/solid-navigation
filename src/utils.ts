export const createRouteID = (prefix: string, length = 16) => {
  return (
    prefix +
    "-" +
    parseInt(
      Math.ceil(Math.random() * Date.now())
        .toPrecision(length)
        .toString()
        .replace(".", "")
    )
  );
};
