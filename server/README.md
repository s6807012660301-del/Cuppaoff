# Waitlist API

## Local setup

1. Create a MySQL database, for example `cuppa`.
2. Copy `.env.example` to `.env` in the project root and add your MySQL and SMTP credentials. The API creates the `waitlist_subscribers` table when it starts.
3. In one terminal, run `pnpm server`.
4. In another terminal, run `pnpm dev` and open the Vite preview. Vite forwards `/api` requests to the API on port 3001.

The SMTP account must be allowed to send mail from the address configured in `SMTP_FROM`. Never commit `.env` or expose these credentials in frontend variables.