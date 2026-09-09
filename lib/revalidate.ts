'use server'
// app/admin/actions.ts — серверні дії адмінки.
import { revalidatePath } from 'next/cache'

// Скидає кеш публічних сторінок після збереження в адмінці,
// щоб зміни з'явилися на сайті одразу, а не через 5 хвилин.
export async function revalidateSite() {
  revalidatePath('/', 'layout')
}
