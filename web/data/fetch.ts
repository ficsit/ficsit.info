export async function fetchData(path: string, version: string) {
  const response = await fetch(_dataUrl(path, version), {
    method: 'GET',
  });

  return await response.json();
}

// Internal

function _dataUrl(path: string, version: string) {
  return `${process.env.APP_ORIGIN}/data/${version}/${path}`;
}
