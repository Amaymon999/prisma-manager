# PRISMA Manager (MVP)

### Avvio locale
1. Installa dipendenze
   - `pnpm install`
2. Configura env
   - `cp .env.example .env`
   - metti `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
3. Migra + seed
   - `pnpm prisma:migrate`
   - `pnpm db:seed`
4. Avvia
   - `pnpm dev`
5. Login
   - admin: `admin@prisma.local` / `admin123`

### Deploy Vercel
- Imposta le stesse env vars su Vercel.
- Esegui migrazioni in produzione con `prisma migrate deploy` (es. tramite CI o job).
