
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DEXMetric, SupportTicket, Device } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
    if (!ai) {
        if (process.env.API_KEY && process.env.API_KEY !== "YOUR_API_KEY_HERE") {
            ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        }
    }
    return ai;
}

const generateMockResponse = (text: string) => {
    return new Promise<string>(resolve => setTimeout(() => resolve(text), 1500));
}

export const generateDEXReport = async (metrics: DEXMetric[], devices: Device[]): Promise<string> => {
    const aiInstance = getAI();
    if (!aiInstance) {
        return generateMockResponse(`
### AI-Generated Digital Experience (DEX) Report

**Overall Assessment:** The system's digital experience is largely positive, with a notable strength in Application Stability and User Sentiment. However, Resource Usage on end-user devices presents a clear area for improvement.

**Key Insights:**
*   **Application Stability (Score: 98):** Excellent performance. Crash-free session rate is well above industry standards. Maintain current monitoring practices.
*   **User Sentiment (Score: 91):** Proactive support and quick resolutions are paying off. Users report high satisfaction in feedback channels.
*   **Network Health (Score: 85):** Generally stable, but minor latency spikes were detected during peak hours, correlating with reports from Wing C.
*   **Resource Usage (Score: 78):** This is the primary concern. Several devices, including 'Marketing Desktop - Bob', are showing sustained high CPU/memory usage. This can lead to slowdowns and user frustration.

**Recommendations:**
1.  **Investigate High Resource Devices:** Prioritize analysis of devices with low resource scores. Check for background processes, outdated software, or malware. Consider hardware upgrades for persistently slow machines.
2.  **Optimize Network in Wing C:** Analyze traffic patterns for the Wing C switch to identify the cause of peak hour latency.
3.  **Proactive Maintenance on 'Web Server 2':** The server flagged with a 'Warning' status should be investigated immediately to prevent service degradation.
        `);
    }

    const prompt = `
Generate a Digital Experience (DEX) report based on the following data.
Provide an Overall Assessment, Key Insights, and actionable Recommendations.

**Metrics:**
${metrics.map(m => `- ${m.name}: Score ${m.score} (${m.description})`).join('\n')}

**Device Status Summary:**
- Online: ${devices.filter(d => d.status === 'Online').length}
- Warning: ${devices.filter(d => d.status === 'Warning').length}
- Offline: ${devices.filter(d => d.status === 'Offline').length}
- Maintenance: ${devices.filter(d => d.status === 'Maintenance').length}
- Notable devices with issues: ${devices.filter(d => d.status === 'Warning' || d.status === 'Offline').map(d => d.name).join(', ')}
`;

    try {
        const response: GenerateContentResponse = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating DEX report:", error);
        return "Error: Could not generate AI report. Please check API key and network connection.";
    }
};

export const getAISupportSuggestion = async (ticket: SupportTicket): Promise<string> => {
    const aiInstance = getAI();
    if (!aiInstance) {
        return generateMockResponse(`
### AI Support Assistant

Based on the ticket details for **"${ticket.subject}"**, here are some potential causes and troubleshooting steps:

**Potential Causes:**
1.  **Service Outage:** The backend service for 'wiki.company.com' might be down or unresponsive. This aligns with the '503 Service Unavailable' error.
2.  **Network Path Issue:** There could be a routing or firewall issue between the user's location and the server hosting the wiki.
3.  **Server Overload:** The web server itself ('Web Server 2' is currently in a warning state) might be overloaded, causing it to fail health checks and return 503 errors.
4.  **Local DNS Issue:** Less likely for a single user, but their machine might have a stale DNS cache.

**Recommended Troubleshooting Steps:**
1.  **Check Server Status:** Verify the status of the web servers responsible for the wiki. The system shows 'Web Server 2' is in a 'Warning' state. **This is the most likely cause.**
2.  **Ping/Traceroute:** From a machine in the same network segment as the reporter, run \`ping wiki.company.com\` and \`tracert wiki.company.com\` to check for connectivity issues.
3.  **Check Firewall Logs:** Review logs on 'Firewall A' for any blocked traffic to or from the wiki servers around the time the issue started.
4.  **Advise User:** Suggest the user clear their browser cache and flush their DNS cache (\`ipconfig /flushdns\` on Windows).
        `);
    }

    const prompt = `
As an IT support specialist, provide potential causes and recommended troubleshooting steps for the following support ticket. Be concise and practical.

**Ticket Subject:** ${ticket.subject}
**Ticket Description:** ${ticket.description}
**Reporter:** ${ticket.reporter}
`;

    try {
        const response: GenerateContentResponse = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating support suggestion:", error);
        return "Error: Could not get AI suggestion.";
    }
};

export const generateMaintenancePlan = async (devices: Device[]): Promise<string> => {
    const aiInstance = getAI();
    if (!aiInstance) {
        return generateMockResponse(`
### AI-Generated Proactive Maintenance Plan

Based on the current device inventory and status, here is a suggested maintenance plan for the next quarter:

**Priority 1: Immediate Action**
*   **Device:** Web Server 2 (Prod)
*   **Task:** Diagnose 'Warning' status. Perform full hardware diagnostics and log analysis.
*   **Reasoning:** Critical production server showing signs of failure.

**Priority 2: Security & Reliability**
*   **Device(s):** All Servers (Web Server 1, Web Server 2, DB Server 1)
*   **Task:** Schedule rolling monthly OS patch deployment during off-peak hours.
*   **Reasoning:** Mitigates security vulnerabilities and ensures system stability.

**Priority 3: Infrastructure Health**
*   **Device:** Core Router 1
*   **Task:** Review and audit firmware version against latest stable release from Cisco. Plan upgrade if necessary.
*   **Reasoning:** Core network devices are critical infrastructure. Outdated firmware can have bugs or security flaws.

**Priority 4: Lifecycle Management**
*   **Device:** Marketing Desktop - Bob
*   **Task:** Flag for potential hardware refresh review in the next budget cycle.
*   **Reasoning:** DEX metrics indicate potential performance bottlenecks on this machine, which may be due to age.
        `);
    }

    const prompt = `
Act as a senior IT systems administrator. Create a proactive maintenance plan based on this list of devices. Focus on reliability, security, and performance.

**Device List:**
${devices.map(d => `- ${d.name} (Type: ${d.type}, Status: ${d.status}, OS: ${d.os})`).join('\n')}
`;
     try {
        const response: GenerateContentResponse = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating maintenance plan:", error);
        return "Error: Could not generate AI plan.";
    }
}
