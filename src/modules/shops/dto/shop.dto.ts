export class ShopDTO {
  id: string;
  name: string;
  openingHour: string;
  closingHour: string;
  availability: 'busy' | 'open' | 'closed';
}