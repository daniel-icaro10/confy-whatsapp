import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export interface SmtpConfig {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    fromEmail: string;
    fromName?: string | null;
}

export function createTransporter(config: SmtpConfig) {
    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
            user: config.user,
            pass: config.pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}

export async function testSmtpConnection(config: SmtpConfig): Promise<{ success: boolean; message: string }> {
    try {
        const transporter = createTransporter(config);
        await transporter.verify();
        return { success: true, message: "Conexão com servidor SMTP estabelecida com sucesso!" };
    } catch (err: any) {
        return { success: false, message: `Erro ao conectar no SMTP: ${err.message || err}` };
    }
}

export async function sendEmail({
    config,
    to,
    subject,
    html
}: {
    config: SmtpConfig;
    to: string;
    subject: string;
    html: string;
}) {
    const transporter = createTransporter(config);
    const from = config.fromName ? `"${config.fromName}" <${config.fromEmail}>` : config.fromEmail;

    return await transporter.sendMail({
        from,
        to,
        subject,
        html
    });
}
