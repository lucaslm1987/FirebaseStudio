
'use server';

/**
 * @fileOverview An intelligence agent for analyzing occurrence data.
 *
 * - askIntelligence - A function that answers questions about occurrence data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore, collection, getDocs, query, where, Timestamp, WhereFilterOp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const GetOccurrencesInputSchema = z.object({
  filters: z.array(z.object({
    field: z.string().describe("Field to filter on (e.g., 'factDate', 'nature', 'neighborhood')"),
    operator: z.enum(['<', '<=', '==', '!=', '>=', '>', 'array-contains', 'in', 'not-in', 'array-contains-any']).describe("The query operator."),
    value: z.any().describe("The value to compare against. For date queries, use YYYY-MM-DD format."),
  })).optional().describe("Array of filters to apply to the query."),
});

// Tool to get occurrence reports from Firestore
const getOccurrences = ai.defineTool(
  {
    name: 'getOccurrences',
    description: 'Retrieves a list of occurrence reports from the database. Can be filtered.',
    inputSchema: GetOccurrencesInputSchema,
    outputSchema: z.any(),
  },
  async ({ filters }) => {
    console.log('Tool: getOccurrences called with filters:', filters);
    const { firestore } = initializeFirebase();
    const reportsCollection = collection(firestore, 'occurrence_reports');
    
    let q = query(reportsCollection);

    if (filters && filters.length > 0) {
        const queryConstraints = filters.map(f => {
             let value = f.value;
             // Convert date strings to Timestamps for date fields
             if (f.field.toLowerCase().includes('date') && typeof f.value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(f.value)) {
                 value = Timestamp.fromDate(new Date(f.value));
             }
             return where(f.field, f.operator as WhereFilterOp, value);
        });
        q = query(reportsCollection, ...queryConstraints);
    }

    const querySnapshot = await getDocs(q);
    const reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Tool: Found ${reports.length} reports.`);
    // Return only essential fields to the model to save tokens
    return reports.map(r => ({
        id: r.id,
        factDate: r.factDate,
        factTime: r.factTime,
        nature: r.nature,
        neighborhood: r.neighborhood,
        street: r.street,
        latitude: r.latitude,
        longitude: r.longitude,
    }));
  }
);


const prompt = ai.definePrompt({
    name: 'intelligencePrompt',
    system: `You are an expert security data analyst for the Guarda Civil Municipal (GCM).
Your goal is to answer questions from users based on occurrence report data.
Use the 'getOccurrences' tool to fetch the data you need.
Be concise and clear in your answers.
If you are asked to generate a chart, you MUST output the data in a JSON code block with the language specifier 'chart'.

The JSON structure for charts is:
{
  "type": "bar" | "line" | "pie",
  "data": [ ... ], // Array of data objects for the chart
  "config": { ... } // Configuration for the chart axes and keys
}

For bar and line charts, the config should be:
"config": { "xAxis": "key_for_x_axis", "yAxis": "key_for_y_axis" }

For pie charts, the config should be:
"config": { "dataKey": "key_for_values", "nameKey": "key_for_names" }
For pie charts, the data array should also include a 'fill' property for the color of each slice. Generate nice, distinct colors.

Today is ${new Date().toLocaleDateString('pt-BR')}.
Analyze the data and provide a helpful response. If the user asks for a location-based analysis, state that map features are under development.
Do not invent data. If you cannot answer with the available tool, say so.
`,
    tools: [getOccurrences],
    output: { format: 'markdown' },
});


const intelligenceFlow = ai.defineFlow(
  {
    name: 'intelligenceFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (promptMessage) => {
    const llmResponse = await prompt(promptMessage);

    if (!llmResponse || !llmResponse.output) {
      console.error('Invalid response from model:', llmResponse);
      throw new Error("Resposta inválida do modelo de IA. A propriedade 'output' não foi encontrada.");
    }
    
    return llmResponse.output;
  }
);


export async function askIntelligence(prompt: string): Promise<string> {
    return await intelligenceFlow(prompt);
}
