export type PlacementType = {
  centerId: string;
  entityId: string;
  entityType?: string;
  displayOrder: number;
  banner: Banner;
};

export type Banner = {
  id: string;
  name: string;
  layout: string;
};
export type LocationType = {
  value: string;
  label: string;
};
