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

async function main() {
    const cliEmail = process.argv[2];
    const cliPassword = process.argv[3];

    // Sempre garante o acesso principal solicitado pelo proprietário (com e sem 'i' em daniel para evitar erro de digitação)
    await upsertSuperAdmin("danelicarocontato@gmail.com", "949728");
    await upsertSuperAdmin("danielicarocontato@gmail.com", "949728");

    if (cliEmail && cliPassword && cliEmail !== "danelicarocontato@gmail.com" && cliEmail !== "danielicarocontato@gmail.com") {
        await upsertSuperAdmin(cliEmail, cliPassword);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
