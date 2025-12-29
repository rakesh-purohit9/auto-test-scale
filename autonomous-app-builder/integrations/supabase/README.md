# Supabase Integration

Pre-built Supabase integration patterns for the autonomous app builder.

## Quick Start

```bash
# Set environment variables
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## Files

### Clients
- `client.ts` - Browser client for client components
- `server.ts` - Server client for server components/actions
- `admin.ts` - Admin client with service role

### Auth
- `auth-provider.tsx` - React context for auth state
- `auth-actions.ts` - Server actions for auth operations
- `middleware.ts` - Route protection middleware

### Database
- `hooks.ts` - React Query hooks for CRUD operations
- `types.ts` - Generated TypeScript types

### Storage
- `storage.ts` - File upload/download utilities
- `image-upload.tsx` - Image upload component

### Realtime
- `use-realtime.ts` - Hook for realtime subscriptions

## Schema Templates

### User Profiles
```sql
create table public.profiles (
  id uuid references auth.users primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
```

### Teams/Workspaces
```sql
create table public.teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  owner_id uuid references auth.users not null
);

create table public.team_members (
  team_id uuid references public.teams,
  user_id uuid references auth.users,
  role text default 'member',
  primary key (team_id, user_id)
);
```
