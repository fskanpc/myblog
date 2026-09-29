-- My Little Bubble: ตารางและสิทธิ์การเข้าถึง
-- วิธีใช้: Supabase Dashboard → SQL Editor → New query → วางทั้งไฟล์ → Run

-- 1) โปรไฟล์และการตั้งค่า (ชื่อเล่น รูป ธีม ภาษา ฯลฯ) หนึ่งแถวต่อผู้ใช้
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  meta       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2) ข้อมูลทุกหมวด (ไดอารี่ หนังสือ ไพ่ ที่เที่ยว หนัง เพลง คำศัพท์ แพลนเนอร์)
create table if not exists public.items (
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  id         text not null,
  section    text not null check (section in ('diary','books','tarot','travel','screen','music','vocab','planner')),
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);
create index if not exists items_user_section_idx on public.items (user_id, section);

-- 3) อัปเดตเวลาแก้ไขล่าสุดอัตโนมัติ
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists items_touch on public.items;
create trigger items_touch before update on public.items
  for each row execute function public.touch_updated_at();

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- 4) Row Level Security: แต่ละคนเห็นและแก้ได้เฉพาะข้อมูลของตัวเอง
alter table public.profiles enable row level security;
alter table public.items    enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "profiles_delete_own" on public.profiles for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "items_select_own" on public.items;
drop policy if exists "items_insert_own" on public.items;
drop policy if exists "items_update_own" on public.items;
drop policy if exists "items_delete_own" on public.items;
create policy "items_select_own" on public.items for select to authenticated using ((select auth.uid()) = user_id);
create policy "items_insert_own" on public.items for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "items_update_own" on public.items for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "items_delete_own" on public.items for delete to authenticated using ((select auth.uid()) = user_id);
