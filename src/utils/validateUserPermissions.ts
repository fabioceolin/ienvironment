type User = {
  roles: string[];
};
type ValidateUserPermissionsParams = {
  user: User;
  role?: string;
};

export function validateUserPermissions({
  user,
  role,
}: ValidateUserPermissionsParams) {
  if (role) {
    return user.roles.includes(role);
  }

  return true;
}
