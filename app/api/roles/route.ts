import { getAllRoles } from "@/lib/dynamodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "all") {
      const roles = await getAllRoles();
      return Response.json(roles);
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, checks } = body;

    if (!role || !checks || checks.length === 0) {
      return Response.json(
        { error: "Please provide role and checks" },
        { status: 400 }
      );
    }

    // Call Lambda function
    const lambdaResponse = await fetch(
      process.env.LAMBDA_API_URL!,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, checks }),
      }
    );

    const result = await lambdaResponse.json();
    return Response.json(result);

  } catch (error) {
    return Response.json(
      { error: "Calculation failed" },
      { status: 500 }
    );
  }
}