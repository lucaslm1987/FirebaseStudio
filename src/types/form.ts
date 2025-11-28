
export type Vehicle = {
  id: string;
  plate?: string;
  model?: string;
};

export type FormData = {
  narrative: string;
  items: {
    vehicles: Vehicle[];
  };
};

export const defaultFormData: FormData = {
  narrative: "",
  items: {
    vehicles: [],
  },
};
