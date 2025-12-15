"use server"

import React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export default async function sendEmail(to:string, subject:string, body:string) {
    try {
        const  response = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: to,
            subject: subject,
            react: React.createElement("h1", null, body),
        });
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
}