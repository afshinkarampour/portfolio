export const formatErrorMessages = (errorDetail: any) => {
  return Object.entries(errorDetail)
    .flatMap(([key, messages]: any) =>
      messages.map((message: any) => `${message}`)
    )
    .join("<br />\n");
};
