import { MealTime } from '../enum/meal-time';

export class ShowPostDto {
  idx: number;
  title: string;
  contents: string;
  maxCount: number;
  mealTime: MealTime;
  writer: string;
}
