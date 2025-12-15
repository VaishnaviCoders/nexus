"use server"


// Base request fields (common to all)
interface BaseWhatsappMessageRequest {
  messaging_product: "whatsapp";
  to: string; // E.164 phone number, e.g., "+1234567890"
  recipient_type?: "individual"; // Defaults to "individual"
}

// Text message request (discriminated by type: "text")
interface WhatsappTextMessageRequest extends BaseWhatsappMessageRequest {
  type: "text";
  text: {
    body: string; // Max 4096 chars
    preview_url?: boolean; // Default: false; enables URL preview
  };
}

// Component for templates (discriminated by type)
type WhatsappTemplateComponentType = "header" | "body" | "button";

interface BaseWhatsappTemplateComponent {
  type: WhatsappTemplateComponentType;
  parameters?: WhatsappTemplateParameter[];
}

interface WhatsappTemplateHeaderComponent extends BaseWhatsappTemplateComponent {
  type: "header";
}

interface WhatsappTemplateBodyComponent extends BaseWhatsappTemplateComponent {
  type: "body";
  // Body params restricted to text/currency/date_time
  parameters?: Extract<WhatsappTemplateParameter, { type: "text" | "currency" | "date_time" }>[]; // Type narrowing
}

interface WhatsappTemplateButtonComponent extends BaseWhatsappTemplateComponent {
  type: "button";
  sub_type: "quick_reply" | "url" | "catalog" | "phone_number" | "otp" | "auth";
  index: number; // 0-9, max 10 buttons
  parameters: WhatsappTemplateParameter[]; // Required for buttons
}

type WhatsappTemplateComponent =
  | WhatsappTemplateHeaderComponent
  | WhatsappTemplateBodyComponent
  | WhatsappTemplateButtonComponent;

// Template parameter (discriminated by type)
type WhatsappTemplateParameterType =
  | "text"
  | "currency"
  | "date_time"
  | "image"
  | "document"
  | "video";

interface BaseWhatsappTemplateParameter {
  type: WhatsappTemplateParameterType;
}

// Text param
interface WhatsappTextParameter extends BaseWhatsappTemplateParameter {
  type: "text";
  text: string; // Max 1024 chars (body), 60 (header)
}

// Currency param
interface WhatsappCurrencyParameter extends BaseWhatsappTemplateParameter {
  type: "currency";
  currency: {
    code: string; // ISO 4217, e.g., "USD"
    amount_1000: number; // Amount * 1000, e.g., 1500 for $1.50
    fallback_value: string; // Default text
  };
}

// DateTime param
interface WhatsappDateTimeParameter extends BaseWhatsappTemplateParameter {
  type: "date_time";
  date_time: {
    fallback_value: string; // Always used in Cloud API
    // Optional ISO-like fields for formatting
    day_of_week?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    year?: number;
    month?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    day_of_month?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;
    hour?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;
    minute?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59;
    second?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59;
  };
}

// Media params (image, document, video)
type WhatsappMediaType = "image" | "document" | "video";

interface BaseWhatsappMediaParameter extends BaseWhatsappTemplateParameter {
  // Use either id (uploaded) or link (hosted)
  id?: string; // From WhatsApp media upload
  link?: string; // Public HTTPS URL (<16MB)
}

interface WhatsappImageParameter extends BaseWhatsappMediaParameter {
  type: "image";
  // No caption in templates
}

interface WhatsappDocumentParameter extends BaseWhatsappMediaParameter {
  type: "document";
  filename?: string; // Defines extension, e.g., "invoice.pdf"; PDF only in templates
}

interface WhatsappVideoParameter extends BaseWhatsappMediaParameter {
  type: "video";
  // Max 16MB, <1min duration
}

type WhatsappTemplateParameter =
  | WhatsappTextParameter
  | WhatsappCurrencyParameter
  | WhatsappDateTimeParameter
  | WhatsappImageParameter
  | WhatsappDocumentParameter
  | WhatsappVideoParameter;

// Template message request (discriminated by type: "template")
interface WhatsappTemplateMessageRequest extends BaseWhatsappMessageRequest {
  type: "template";
  template: {
    name: string; // Pre-approved template name
    language: {
      code: string; // e.g., "en_US"
      policy: "deterministic"; // Required for Cloud API
    };
    components?: WhatsappTemplateComponent[]; // Up to 10 params per component
  };
}

// Top-level discriminated union
type WhatsappMessageRequest =
  | WhatsappTextMessageRequest
  | WhatsappTemplateMessageRequest;




export async function sendWhatsAppMessage(payload: WhatsappMessageRequest) {
    try {
      const response = await fetch(`https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("WhatsApp API Response:", data); // Optional logging
    return {
      success: true,
      data,
    };
    } catch (error) {
       console.error("WhatsApp Send Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message",
    };
    }
}