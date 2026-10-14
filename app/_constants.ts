
const inputFileSets: IFileSet[] = [
  [{ label: '.png' }, { label: '.webp' }, { label: '.tif', color: '#ff8d67' }],
  [{ label: '.jpg' }, { label: '.jpeg' }, { label: '.webp', color: '#40b782' }],
  [{ label: '.bmp' }, { label: '.ico' }, { label: '.heic', color: '#ff8d67' }],
  [{ label: '.webp' }, { label: '.avif' }, { label: '.jpg', color: '#40b782' }],
  [{ label: '.png' }, { label: '.ico' }, { label: '.heic' }],
];

const outputFileSets: IFileSet[] = [
  [{ label: '.jpg' }, { label: '.png' }, { label: '.tif', color: '#ff8d67' }],
  [{ label: '.webp' }, { label: '.png' }, { label: '.ico', color: '#40b782' }],
  [{ label: '.tif' }, { label: '.png' }, { label: '.jpeg', color: '#ff8d67' }],
];
