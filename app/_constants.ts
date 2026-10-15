
export const inputFileSets: IFileSet[] = [
  [{ label: '.png' }, { label: '.webp', color: '#40b782' }, { label: '.tif', color: '#f87171' }],
  [{ label: '.jpg', color: '#ff8d67' }, { label: '.jpeg', color: '#ffb347' }, { label: '.webp', color: '#40b782' }],
  [{ label: '.bmp', color: '#60a5fa' }, { label: '.ico', color: '#facc15' }, { label: '.heic', color: '#f472b6' }],
  [{ label: '.webp', color: '#40b782' }, { label: '.avif', color: '#2dd4bf' }, { label: '.jpg', color: '#ff8d67' }],
  [{ label: '.png' }, { label: '.ico', color: '#facc15' }, { label: '.heic', color: '#f472b6' }],
];

export const outputFileSets: IFileSet[] = [
  [{ label: '.jpg', color: '#ff8d67' }, { label: '.png' }, { label: '.tif', color: '#f87171' }],
  [{ label: '.webp', color: '#40b782' }, { label: '.png' }, { label: '.ico', color: '#facc15' }],
  [{ label: '.tif', color: '#f87171' }, { label: '.png' }, { label: '.jpeg', color: '#ffb347' }],
];
