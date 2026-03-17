import { getAllRoles, getRoleByName } from "@/lib/dynamodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roleName = searchParams.get("role");

    if (roleName) {
      const role = await getRoleByName(roleName);
      if (!role) {
        return Response.json(
          { error: "Role not found" },
          { status: 404 }
        );
      }
      return Response.json(role);
    }

    const roles = await getAllRoles();
    return Response.json(roles);

  } catch (error) {
    return Response.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}