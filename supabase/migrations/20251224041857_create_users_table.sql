-- Supabase schema for Michid site
-- Tables: categories, usages, products

-- Categories
create table if not exists categories (
  id text primary key,
  title_key text,
  image text
);

-- Usages
create table if not exists usages (
  key text primary key,
  label text
);

-- Products
create table if not exists products (
  id bigint primary key,
  title text,
  description text,
  image text,
  images jsonb,
  price text,
  material text,
  origin text,
  features jsonb,
  category_id text references categories(id) on delete set null,
  usage text references usages(key) on delete set null
);

-- Seed categories
insert into categories (id, title_key, image) values
('women','category_women','https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop') on conflict (id) do nothing;
insert into categories (id, title_key, image) values
('men','category_men','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop') on conflict (id) do nothing;
insert into categories (id, title_key, image) values
('kids','category_acc','https://images.unsplash.com/photo-1503919545885-7f4941199540?q=80&w=800&auto=format&fit=crop') on conflict (id) do nothing;

-- Seed usages
insert into usages (key, label) values ('ceremonial','Ceremonial') on conflict (key) do nothing;
insert into usages (key, label) values ('everyday','Everyday') on conflict (key) do nothing;
insert into usages (key, label) values ('winter','Winter') on conflict (key) do nothing;

-- Seed products (ids match initial data.ts)
insert into products (id, title, description, image, images, price, material, origin, features, category_id, usage) values
(1,'Midnight Hunnu','Deep blue silk with gold embroidery.','https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&auto=format&fit=crop', '["https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1515664069236-68a74c369d97?q=80&w=800&auto=format&fit=crop"]','₮1,200,000','100% Mongolian Silk, Gold Thread','Handcrafted in Ulaanbaatar','["Traditional Hunnu Collar","Double stitching","Silk lining"]','men','ceremonial') on conflict (id) do nothing;

insert into products (id, title, description, image, images, price, material, origin, features, category_id, usage) values
(2,'Royal Crimson','Traditional red with modern cuts.','https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop','["https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1589465885857-44edb59ef523?q=80&w=800&auto=format&fit=crop"]','₮1,500,000','Premium Cashmere & Silk Blend','Designed by Michid Studio','["Embroidery accents","Fitted waist","Ceremonial grade"]','women','ceremonial') on conflict (id) do nothing;

insert into products (id, title, description, image, images, price, material, origin, features, category_id, usage) values
(3,'Ivory Elegance','Pure white cashmere blend.','https://images.unsplash.com/photo-1548883354-94bcfe321cbb?q=80&w=800&auto=format&fit=crop','["https://images.unsplash.com/photo-1548883354-94bcfe321cbb?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1620898516104-c3c2710668f4?q=80&w=800&auto=format&fit=crop"]','₮1,800,000','Pure Organic Cashmere','Sourced from Gobi Desert','["Winter ready","Soft touch finish","Pearl buttons"]','women','winter') on conflict (id) do nothing;

insert into products (id, title, description, image, images, price, material, origin, features, category_id, usage) values
(4,'Warrior''s Tunic','Robust fabric for everyday elegance.','https://images.unsplash.com/photo-1507680434567-d47775128624?q=80&w=800&auto=format&fit=crop','["https://images.unsplash.com/photo-1507680434567-d47775128624?q=80&w=800&auto=format&fit=crop"]','₮900,000','Durable Wool Blend','Michid Workshop','["Modern cut","Breathable","Deep pockets"]','men','everyday') on conflict (id) do nothing;

insert into products (id, title, description, image, images, price, material, origin, features, category_id, usage) values
(5,'Little Prince','Ceremonial wear for children.','https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=800&auto=format&fit=crop','["https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=800&auto=format&fit=crop"]','₮450,000','Soft Cotton & Silk','Handmade','["Adjustable size","Bright colors","Easy care"]','kids','ceremonial') on conflict (id) do nothing;

insert into products (id, title, description, image, images, price, material, origin, features, category_id, usage) values
(6,'Amethyst Dream','A luxurious purple silk deel for evening wear.','https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop','["https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop"]','₮1,600,000','100% Silk','Ulaanbaatar Studio','["Purple Hue","Silk Sash","Evening Wear"]','women','ceremonial') on conflict (id) do nothing;

-- Orders table (customers place orders with phone and address, items stored as jsonb)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  phone text,
  address text,
  items jsonb,
  total bigint,
  status text default 'new',
  created_at timestamptz default now()
);

-- Clients table (partners)
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text,
  logo text,
  url text
);

-- Celebrities (for gallery)
create table if not exists celebrities (
  id uuid primary key default gen_random_uuid(),
  name text,
  image text,
  note text
);

-- Seed clients (logo left null — upload using /api/admin/upload and update via admin POST)
insert into clients (name, logo, url) values
('MongolBank', null, 'https://www.mongolbank.mn') on conflict do nothing;
insert into clients (name, logo, url) values
('Erdenes', null, 'https://erdenes.mn') on conflict do nothing;

-- Seed celebrities (image null — use upload endpoint to set images)
insert into celebrities (name, image, note) values
('Tsetseg', null, 'Traditional model and ambassador') on conflict do nothing;
insert into celebrities (name, image, note) values
('Bold', null, 'Actor and cultural figure') on conflict do nothing;

-- Site settings (hero content, socials etc.) stored as key/json
create table if not exists site_settings (
  key text primary key,
  value jsonb
);

-- Seed a basic hero and socials
insert into site_settings (key, value) values
('hero', '{"title_mn":"Хатагтайн Дээл","title_en":"Michid Deel","subtitle_mn":"Тансаг уламжлалт хувцас","subtitle_en":"Modern traditional deel","image":null}'::jsonb) on conflict (key) do nothing;

insert into site_settings (key, value) values
('socials', '[{"name":"instagram","url":"https://instagram.com","icon":null},{"name":"facebook","url":"https://facebook.com","icon":null}]'::jsonb) on conflict (key) do nothing;
