export interface Address {
  address_id: string;
  name: string;
  firstname: string;
  lastname: string;
  address_1: string;
  address_2: string;
  flat?: string;
  road: string;
  area: string;
  landmark?: string;
  latitude?: string;
  longitude?: string;
  mobile_country_code: string;
  mobile: string;
  default: number; // 0 | 1
  city: string;
  country: string;
  zone?: string;
}

export interface AddressFormData {
  name: string;
  firstname: string;
  lastname: string;
  address_1: string;
  address_2: string;
  road: string;
  area: string;
  landmark: string;
  latitude: string;
  longitude: string;
  mobile_country_code: string;
  mobile: string;
  default: number;
}
