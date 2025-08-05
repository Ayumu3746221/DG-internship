type Meta = {
  version: string;
  isSuccess: boolean;
  message: string;
};

type Prefecture = {
  code: string;
  name: string;
};

type Platform = "ios" | "android";

type Customer = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  birthDate: string;
  prefecture: Prefecture;
};

type App = {
  id: string;
  name: string;
  iconImageUrl: string;
  platform: Platform;
};

type Item = {
  id: string;
  appId: string;
  name: string;
  imageUrl: string;
  price: number;
  currency: string;
  category: string;
};

type Order = {
  id: string;
  orderAt: number;
  customer: Customer;
  app: App;
  paymentMethod: string;
  item: Item;
};

export type MockAPIResponse = {
  meta: Meta;
  orders: Order[];
};
