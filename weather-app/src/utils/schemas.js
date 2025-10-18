import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Логін обов'язковий")
    .regex(
      /^[a-zA-Zа-яА-Я]+\d+$/,
      "Логін повинен містити ім'я та номер курсу (наприклад: mark4)"
    )
    .refine((val) => val.length >= 3, "Логін має бути не менше 3-х символів"),
  password: z
    .string()
    .min(1, "Пароль обов'язковий")
    .min(3, "Пароль має бути не менше 3-х символів"),
});
