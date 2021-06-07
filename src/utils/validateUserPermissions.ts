type User = {
  role: string;
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
    return user.role === role;
  }

  return true;
}
