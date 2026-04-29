import { APP_CONFIG } from "../config/app";

export function formatMoeda(valor: number) {
  return new Intl.NumberFormat(APP_CONFIG.locale, {
    style: "currency",
    currency: APP_CONFIG.currency,
  }).format(valor);
}