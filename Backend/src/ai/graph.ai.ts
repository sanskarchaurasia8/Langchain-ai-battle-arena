import {StateGraph, StateSchema, START, END, type GraphNode , type CompiledStateGraph} from '@langchain/langgraph';
import z from 'zod';
import { mistrAIModel, cohereModel, geminiModel } from './model.ai.js';
import { createAgent, HumanMessage, providerStrategy} from 'langchain';



const state = new StateSchema({
    problem: z.string().default(""),
    solution_1: z.string().default(""),
    solution_2: z.string().default(""),
    judge: z.object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
        solution_1_reasoning: z.string().default(""),
        solution_2_reasoning: z.string().default(""),
    })
})


const solutionNode: GraphNode<typeof state> = async (state) => {
    const prompt = `Solve this problem: ${state.problem}. 
    Inside your response, use markdown only for code blocks. 
    IMPORTANT: All JavaScript template strings and console.log statements containing variables MUST use backticks (\`) and the \${variable} syntax. 
    Ensure the code is syntactically perfect. 
    Do NOT wrap the entire JSON message in markdown blocks.`;

    const [mistralResponse, cohereResponse] = await Promise.all([
        mistrAIModel.invoke(prompt),
        cohereModel.invoke(prompt)
    ]);

    return {
        solution_1: mistralResponse.text,
        solution_2: cohereResponse.text,
    }
}


const judgeNode: GraphNode<typeof state> = async (state) => {
    const {problem, solution_1, solution_2} = state;
    
    const invokeJudge = async (targetModel: any) => {
        const judge = createAgent({
            model: targetModel,
            responseFormat: providerStrategy(z.object({
                solution_1_score: z.number().min(0).max(10),
                solution_2_score: z.number().min(0).max(10),
                solution_1_reasoning: z.string(),
                solution_2_reasoning: z.string(),  
            })),
            systemPrompt: `You are an expert technical judge. Evaluate two solutions to a coding problem.
            Provide a score out of 10 for each.
            Be critical of performance, readability, and correctness.
            Your reasoning should be concise and professional.`
        });

        const response = await judge.invoke({
            messages: [
                new HumanMessage(`
                    Problem: ${problem}
                    Solution 1: ${solution_1}
                    Solution 2: ${solution_2}
                    Please evaluate the two solutions and provide your scores and reasoning.
                `)
            ]
        });

        return response.structuredResponse;
    };

    try {
        const result = await invokeJudge(geminiModel);
        return {
            judge: result
        };
    } catch (error) {
        console.error("Primary judge failed, attempting fallback with Mistral:", error);
        try {
            const result = await invokeJudge(mistrAIModel);
            return {
                judge: result
            };
        } catch (fallbackError) {
            console.error("All judges failed:", fallbackError);
            throw fallbackError;
        }
    }
}


const graph = new StateGraph(state)
    .addNode("solution", solutionNode)
    .addNode("judge_node", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge_node")
    .addEdge("judge_node", END)
    .compile()


    export default async function runGraph(problem: string) {
        const result = await graph.invoke({
            problem: problem
        })

        return result;
    }