export interface CountData {
  id: number;
  countTitle: string;
  description: string;
  count: number;
  targetCount: number;
  color: string;
  fg: string;
}

// Type for items in the grid, including placeholder
export type DataItem = CountData | { isPlaceholder: true };

// Type guard function
export function isPlaceholderItem(item: DataItem): item is { isPlaceholder: true } {
  return 'isPlaceholder' in item;
}
