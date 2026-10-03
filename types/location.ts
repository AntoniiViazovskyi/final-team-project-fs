export type Location = {
  _id: string;
  image: string;
  name: string;
  locationType: string;
  region: string;
  rate: number;
  description: string;
  advantages: string[];
  coordinates: {
    lat: number;
    lon: number;
  };
  ownerId: string | null;
  feedbacksId: string[];
  feedbacksCount: number;
  createdAt: string;
  updatedAt: string;
};

export type LocationsHttpResponse = {
  page: number;
  limit: number;
  totalLocations: number;
  totalPages: number;
  locations: Location[];
};

export type LocationOwner = {
  _id: string;
  name: string;
  avatarUrl: string;
};

export type LocationDetails = {
  _id: string;
  image: string;
  name: string;
  locationType: string;
  region: string;
  rate: number;
  description: string;
  advantages: string[];
  coordinates: {
    lat: number;
    lon: number;
  };
  ownerId: LocationOwner | null;
  feedbacksId: string[];
  feedbacksCount: number;
  createdAt: string;
  updatedAt: string;
};
