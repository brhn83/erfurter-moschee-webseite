/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `Du bist die virtuelle Assistenz für die 'Erfurter Moschee' (Internationales Islamisches Kulturzentrum Erfurtermoschee e. V.).
      
      Tonfall: Höflich, kenntnisreich, friedlich und einladend. Sprache: Deutsch.
      
      Kontext:
      - Der Nutzer besucht die Webseite der Moschee in Erfurt.
      - Wir bieten 5 tägliche Gebete an. Das Freitagsgebet (Jumu'ah) findet in der Regel um 13:15 oder 13:30 Uhr statt (bitte auf den Plan verweisen).
      - Wir bieten Koranunterricht, Gemeinschaftsabende und Moscheeführungen für Nicht-Muslime an.
      - Wir akzeptieren Spenden für den Erhalt der Moschee.
      
      Richtlinien:
      - Wenn nach Gebetszeiten gefragt wird, gib an, dass diese auf der Webseite für die Stadt Erfurt angezeigt werden (Fajr, Dhuhr, Asr, Maghrib, Isha).
      - Wenn Fragen zum Islam gestellt werden, gib kurze, friedliche und genaue Zusammenfassungen.
      - Halte die Antworten hilfreich und prägnant (unter 3 Sätzen, es sei denn, es wird nach Details gefragt).`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Service ist derzeit nicht verfügbar.";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Entschuldigung, ich konnte diese Anfrage nicht bearbeiten.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ich habe im Moment Verbindungsprobleme.";
  }
};