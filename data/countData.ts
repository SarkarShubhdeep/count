export type CountData = {
  id: number;
  countTitle: string;
  count: number;
  targetCount: number;
  color: string;
};

export const data: CountData[] = [
  { id: 1, countTitle: 'Apply to Jobs', count: 18, targetCount: 36, color: '#7466FF' },
  { id: 2, countTitle: 'Bananas', count: 8, targetCount: 50, color: '#D18665' },
  { id: 3, countTitle: 'Pears', count: 9, targetCount: 12, color: '#D0D85A' },
  { id: 4, countTitle: 'Oranges', count: 15, targetCount: 18, color: '#DE5C2F' },
  { id: 5, countTitle: 'Grapes', count: 5, targetCount: 10, color: '#458C6A' },
];
