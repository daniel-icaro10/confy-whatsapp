const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function upsertSuperAdmin(email, password) {
    if (!email || !password) return;
    const hashedPassword = await bcrypt.hash(String(password), 10);

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        console.log(`User ${email} found. Updating password and promoting to SUPERADMIN...`);
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                role: "SUPERADMIN",
                isActive: true
            }
        });
        console.log(`User ${email} updated successfully!`);
    } else {
        console.log(`Creating new SUPERADMIN user ${email}...`);
        await prisma.user.create({
            data: {
                email,
                name: "Daniel Icaro",
                password: hashedPassword,
                role: "SUPERADMIN",
                isActive: true
            }
        });
        console.log(`Super Admin ${email} created successfully!`);
    }
}

async function cleanupLegacyMockData() {
    try {
        await prisma.drama.deleteMany({
            where: {
                slug: {
                    in: [
                        "o-bilionario-disfarcado-e-a-noiva-rejeitada",
                        "a-vinganca-da-herdeira-esquecida",
                        "gravida-do-ceo-amor-alem-do-contrato"
                    ]
                }
            }
        });

        const funnel = await prisma.funnelConfig.findUnique({ where: { id: "default" } });
        if (
            funnel &&
            (funnel.step1Greeting?.includes("Oiê, meu amor!") ||
                funnel.aiSystemPrompt?.includes("Você é a Sofia, atendente"))
        ) {
            await prisma.funnelConfig.update({
                where: { id: "default" },
                data: {
                    enabled: false,
                    planName: "Acesso Completo — TvDrama Reels",
                    step1Greeting: "",
                    step2OfferMessage: "",
                    pixTriggerKeywords: "",
                    pixGeneratedMessage: "",
                    paymentApprovedMessage: "",
                    useAiSaleswoman: false,
                    aiSystemPrompt: ""
                }
            });
        }
    } catch (err) {
        console.warn("Cleanup skipped:", err?.message);
    }
}

async function upsertViewerVip(phone, email, name) {
    if (!phone) return;
    const clean = phone.replace(/\D/g, "");
    try {
        const existing = await prisma.viewerAccess.findUnique({ where: { phone: clean } });
        if (!existing) {
            await prisma.viewerAccess.create({
                data: {
                    phone: clean,
                    email: email || "admin@tvreels.com",
                    name: name || "Usuário VIP Master",
                    planName: "Acesso VIP Vitalício (Acesso Total)",
                    isVip: true,
                    expiresAt: null
                }
            });
            console.log(`Viewer VIP ${clean} criado com sucesso!`);
        } else {
            await prisma.viewerAccess.update({
                where: { phone: clean },
                data: {
                    isVip: true,
                    expiresAt: null,
                    planName: "Acesso VIP Vitalício (Acesso Total)"
                }
            });
            console.log(`Viewer VIP ${clean} atualizado para VIP vitalício!`);
        }
    } catch (err) {
        console.warn(`Erro ao upsert Viewer VIP ${clean}:`, err?.message);
    }
}

async function main() {
    const cliEmail = process.argv[2];
    const cliPassword = process.argv[3];

    await upsertSuperAdmin("danelicarocontato@gmail.com", "949728");
    await upsertSuperAdmin("danielicarocontato@gmail.com", "949728");
    await upsertSuperAdmin("admin@tvreels.com", "admin123456");

    await upsertViewerVip("5511999999999", "admin@tvreels.com", "Usuário Teste VIP");
    await upsertViewerVip("11999999999", "admin@tvreels.com", "Usuário Teste VIP");

    if (cliEmail && cliPassword && cliEmail !== "danelicarocontato@gmail.com" && cliEmail !== "danielicarocontato@gmail.com" && cliEmail !== "admin@tvreels.com") {
        await upsertSuperAdmin(cliEmail, cliPassword);
    }

    await cleanupLegacyMockData();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
