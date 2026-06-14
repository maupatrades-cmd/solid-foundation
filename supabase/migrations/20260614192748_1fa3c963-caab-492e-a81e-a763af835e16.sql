
DROP POLICY IF EXISTS "Owners and admins can manage roles" ON public.user_roles;

CREATE POLICY "Owners can manage any role"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'owner'))
WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Admins can manage non-privileged roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  AND role NOT IN ('owner', 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  AND role NOT IN ('owner', 'admin')
);
