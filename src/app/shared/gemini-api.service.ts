import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface GeminiChatMessage {
  readonly role: 'user' | 'model';
  readonly text: string;
}

interface GeminiGenerateContentRequest {
  systemInstruction?: {
    readonly parts: Array<{ text: string }>;
  };
  readonly contents: Array<{
    readonly role: 'user' | 'model';
    readonly parts: Array<{ text: string }>;
  }>;
}

interface GeminiGenerateContentResponse {
  readonly candidates?: Array<{
    readonly content?: {
      readonly parts?: Array<{
        readonly text?: string;
      }>;
    };
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiApiService {
  private readonly http = inject(HttpClient);

  generateText(
    apiKey: string,
    prompt: string,
    options?: {
      readonly model?: string;
      readonly systemInstruction?: string;
    }
  ): Observable<string> {
    const requestBody: GeminiGenerateContentRequest = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    };

    if (options?.systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: options.systemInstruction }]
      };
    }

    return this.http
      .post<GeminiGenerateContentResponse>(
        this.buildApiUrl(apiKey, options?.model),
        requestBody
      )
      .pipe(map((response) => this.getResponseText(response)));
  }

  sendChat(
    apiKey: string,
    messages: readonly GeminiChatMessage[],
    options?: {
      readonly model?: string;
      readonly systemInstruction?: string;
    }
  ): Observable<string> {
    const requestBody: GeminiGenerateContentRequest = {
      contents: messages.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }]
      }))
    };

    if (options?.systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: options.systemInstruction }]
      };
    }

    return this.http
      .post<GeminiGenerateContentResponse>(
        this.buildApiUrl(apiKey, options?.model),
        requestBody
      )
      .pipe(map((response) => this.getResponseText(response)));
  }

  private buildApiUrl(apiKey: string, model = 'gemini-2.0-flash'): string {
    return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  }

  private getResponseText(response: GeminiGenerateContentResponse): string {
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return text && text.length > 0 ? text : 'No text response returned by Gemini.';
  }
}
