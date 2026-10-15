-- Spec 07: neue Links kommen nach oben (position = min(position) - 1), also auch negativ.
-- reorder_links() nummeriert beim Sortieren wieder ab 0 durch.
alter table public.links drop constraint links_position_non_negative;
