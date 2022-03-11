import styleImport from 'vite-plugin-imp';

export default function configMockPlugin(isBuild) {
  if (!isBuild) return [];
  return styleImport();
}