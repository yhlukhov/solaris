// Root level
export const BASE_PADDING = 12
// Nested level
export const LEVEL_PADDING = 12

export const itemPadding = (level: number, isFile: boolean) => {
  const fileOffset = isFile ? 16 : 0
  return BASE_PADDING + level * LEVEL_PADDING + fileOffset
}