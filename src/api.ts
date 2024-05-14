export const getPageInReaderView = async (url: string): Promise<string> => {
  try {
    const response = await fetch(`/api/handler?url=${url}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch ${url}`);
    }
    return await response.text();
  } catch (error) {
    throw error;
  }
}
