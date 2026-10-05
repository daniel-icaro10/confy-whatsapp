import { prisma } from "../src/lib/prisma";

async function main() {
    try {
        console.log("🔍 Procurando disparos em andamento ou pausados...");
        const running = await prisma.broadcastLog.findMany({
            where: {
                status: { in: ["running", "paused"] }
            }
        });

        if (running.length === 0) {
            console.log("ℹ️ Nenhum disparo ativo encontrado.");
            return;
        }

        console.log(`⚠️ Encontrado(s) ${running.length} disparo(s) ativo(s):`);
        running.forEach(r => console.log(`   - ID: ${r.id} | Sessão: ${r.sessionId} | Total: ${r.total} | Enviadas: ${r.sent} | Status: ${r.status}`));

        const result = await prisma.broadcastLog.updateMany({
            where: {
                status: { in: ["running", "paused"] }
            },
            data: {
                status: "cancelled",
                completedAt: new Date()
            }
        });

        console.log(`✅ ${result.count} disparo(s) CANCELADO(S) com sucesso! O envio foi interrompido.`);
    } catch (e: any) {
        console.error("❌ Erro ao cancelar disparos:", e.message || e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
