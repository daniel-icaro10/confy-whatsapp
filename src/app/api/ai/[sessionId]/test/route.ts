import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";
import { generateAiReply } from "@/lib/ai-agent";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await context.params;
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado" }, { status: 401 });
        }

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Acesso negado" }, { status: 403 });
        }

        const body = await request.json();
        const { message, history } = body;

        if (!message || typeof message !== "string") {
            return NextResponse.json({ status: false, message: "Mensagem obrigatória" }, { status: 400 });
        }

        const result = await generateAiReply({
            sessionId,
            userMessage: message,
            chatHistory: history || []
        });

        return NextResponse.json({
            status: true,
            data: result
        });
    } catch (error: any) {
        console.error("Erro no teste da IA:", error);
        return NextResponse.json({
            status: false,
            message: error.message || "Erro ao consultar provedor de IA"
        }, { status: 500 });
    }
}
